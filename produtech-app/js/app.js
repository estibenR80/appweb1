/* ============================================================
   app.js — Lógica del aplicativo ProduTech S.A.
   Autenticación por rol, navegación SPA, CRUD de órdenes e
   inventario, dashboard con KPIs y reportes. Sin dependencias.
   ============================================================ */

DB.init();

const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let session = null; // { user, name, role, roleLabel }

const ESTADOS = ["pendiente", "proceso", "completada"];
const ESTADO_LABEL = { pendiente: "Pendiente", proceso: "En proceso", completada: "Completada" };

/* ---------------------- UTILIDADES ---------------------- */
function toast(msg, type = "") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast " + type;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.hidden = true), 2600);
}

function fmtFecha(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

/* ---------------------- LOGIN ---------------------- */
$("#login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const u = $("#username").value.trim().toLowerCase();
  const p = $("#password").value;
  const role = $("#role").value;
  const users = DB.users();
  const err = $("#login-error");

  if (users[u] && users[u].pass === p && users[u].role === role) {
    session = { user: u, ...users[u] };
    err.hidden = true;
    startApp();
  } else {
    err.textContent = "Credenciales o rol incorrectos. Verifique los datos de prueba.";
    err.hidden = false;
  }
});

$("#logout-btn").addEventListener("click", () => {
  session = null;
  $("#app-view").hidden = true;
  $("#login-view").hidden = false;
  $("#login-form").reset();
});

function startApp() {
  $("#login-view").hidden = true;
  $("#app-view").hidden = false;

  // Datos de usuario
  $("#user-name").textContent = session.name;
  $("#user-role").textContent = session.roleLabel;
  $("#user-avatar").textContent = session.name.charAt(0).toUpperCase();

  // Permisos por rol: los operarios no ven elementos .admin-only
  const isAdmin = session.role === "admin";
  $$(".admin-only").forEach((el) => (el.hidden = !isAdmin));

  startClock();
  navigate("dashboard");
}

/* ---------------------- RELOJ ---------------------- */
function startClock() {
  const upd = () => {
    $("#clock").textContent = new Date().toLocaleString("es-CO", {
      weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit"
    });
  };
  upd();
  clearInterval(startClock._t);
  startClock._t = setInterval(upd, 30000);
}

/* ---------------------- NAVEGACIÓN ---------------------- */
$$(".nav-item").forEach((btn) =>
  btn.addEventListener("click", () => navigate(btn.dataset.view))
);

const TITLES = {
  dashboard: "Panel de control",
  ordenes: "Órdenes de producción",
  inventario: "Inventario",
  reportes: "Reportes"
};

function navigate(view) {
  $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $$(".view").forEach((v) => (v.hidden = v.id !== view));
  $("#page-title").textContent = TITLES[view] || "";

  if (view === "dashboard") renderDashboard();
  if (view === "ordenes") renderOrdenes();
  if (view === "inventario") renderInventario();
  if (view === "reportes") renderReportes();
}

/* ---------------------- DASHBOARD ---------------------- */
function renderDashboard() {
  const ord = DB.getOrdenes();
  const inv = DB.getInventario();

  const total = ord.length;
  const completadas = ord.filter((o) => o.estado === "completada").length;
  const enProceso = ord.filter((o) => o.estado === "proceso").length;
  const bajoStock = inv.filter((i) => i.stock < i.minimo).length;
  const cumplimiento = total ? Math.round((completadas / total) * 100) : 0;

  $("#kpi-cards").innerHTML = `
    ${kpi("Órdenes totales", total, "Registradas en el sistema")}
    ${kpi("En proceso", enProceso, "Producción activa", "warn")}
    ${kpi("Completadas", completadas, cumplimiento + "% de cumplimiento", "ok")}
    ${kpi("Materiales críticos", bajoStock, "Por debajo del mínimo", bajoStock ? "danger" : "ok")}
  `;

  // Barras por estado
  $("#status-bars").innerHTML = ESTADOS.map((e) => {
    const n = ord.filter((o) => o.estado === e).length;
    const pct = total ? Math.round((n / total) * 100) : 0;
    return barRow(ESTADO_LABEL[e], pct, n);
  }).join("");

  // Alertas de stock
  const criticos = inv.filter((i) => i.stock < i.minimo);
  $("#stock-alerts").innerHTML = criticos.length
    ? criticos.map((i) => {
        const crit = i.stock < i.minimo / 2 ? "crit" : "";
        return `<li class="${crit}">⚠️ <strong>${i.material}</strong>: ${i.stock} ${i.unidad}
                 (mínimo ${i.minimo} ${i.unidad})</li>`;
      }).join("")
    : `<li class="empty">✅ Todos los materiales están por encima del stock mínimo.</li>`;
}

function kpi(label, value, sub, cls = "") {
  return `<div class="kpi ${cls}">
    <div class="kpi-label">${label}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-sub">${sub}</div>
  </div>`;
}

function barRow(label, pct, val) {
  return `<div class="bar-row">
    <span>${label}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
    <span class="bar-val">${val}</span>
  </div>`;
}

/* ---------------------- ÓRDENES DE PRODUCCIÓN ---------------------- */
function renderOrdenes(filter = "") {
  const ord = DB.getOrdenes();
  const f = filter.toLowerCase();
  const rows = ord.filter(
    (o) => o.producto.toLowerCase().includes(f) || o.id.toLowerCase().includes(f)
  );
  const isAdmin = session.role === "admin";

  $("#ordenes-body").innerHTML = rows.length
    ? rows.map((o) => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.producto}</td>
          <td>${o.cantidad}</td>
          <td>${o.responsable}</td>
          <td>${fmtFecha(o.limite)}</td>
          <td><span class="chip ${o.estado}">${ESTADO_LABEL[o.estado]}</span></td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn btn-secondary btn-sm" onclick="avanzarOrden('${o.id}')">Avanzar estado</button>
            ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="eliminarOrden('${o.id}')">Eliminar</button>` : ""}
          </td>
        </tr>`).join("")
    : `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">Sin órdenes que coincidan.</td></tr>`;
}

$("#orden-search").addEventListener("input", (e) => renderOrdenes(e.target.value));

$("#add-orden-btn").addEventListener("click", () => {
  openModal("Nueva orden de producción", [
    { name: "producto", label: "Producto", type: "text", required: true },
    { name: "cantidad", label: "Cantidad", type: "number", required: true, min: 1 },
    { name: "responsable", label: "Responsable", type: "text", required: true },
    { name: "limite", label: "Fecha límite", type: "date", required: true },
    { name: "estado", label: "Estado", type: "select", options: ESTADOS.map((e) => ({ v: e, t: ESTADO_LABEL[e] })) }
  ], (data) => {
    const ord = DB.getOrdenes();
    const nextNum = 1001 + ord.length;
    ord.push({
      id: "OP-" + nextNum,
      producto: data.producto,
      cantidad: Number(data.cantidad),
      responsable: data.responsable,
      limite: data.limite,
      estado: data.estado || "pendiente"
    });
    DB.saveOrdenes(ord);
    renderOrdenes();
    toast("Orden creada correctamente", "ok");
  });
});

function avanzarOrden(id) {
  const ord = DB.getOrdenes();
  const o = ord.find((x) => x.id === id);
  if (!o) return;
  const idx = ESTADOS.indexOf(o.estado);
  if (idx < ESTADOS.length - 1) {
    o.estado = ESTADOS[idx + 1];
    DB.saveOrdenes(ord);
    renderOrdenes($("#orden-search").value);
    toast(`Orden ${id} → ${ESTADO_LABEL[o.estado]}`, "ok");
  } else {
    toast("La orden ya está completada", "");
  }
}

function eliminarOrden(id) {
  if (!confirm(`¿Eliminar la orden ${id}?`)) return;
  let ord = DB.getOrdenes().filter((o) => o.id !== id);
  DB.saveOrdenes(ord);
  renderOrdenes($("#orden-search").value);
  toast(`Orden ${id} eliminada`, "err");
}

/* ---------------------- INVENTARIO ---------------------- */
function renderInventario(filter = "") {
  const inv = DB.getInventario();
  const f = filter.toLowerCase();
  const rows = inv.filter((i) => i.material.toLowerCase().includes(f));
  const isAdmin = session.role === "admin";

  $("#inventario-body").innerHTML = rows.length
    ? rows.map((i, idx) => {
        const bajo = i.stock < i.minimo;
        return `<tr>
          <td><strong>${i.material}</strong></td>
          <td>${i.stock}</td>
          <td>${i.minimo}</td>
          <td>${i.unidad}</td>
          <td><span class="chip ${bajo ? "bajo" : "ok"}">${bajo ? "Bajo mínimo" : "Suficiente"}</span></td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn btn-secondary btn-sm" onclick="ajustarStock(${idx},1)">＋</button>
            <button class="btn btn-secondary btn-sm" onclick="ajustarStock(${idx},-1)">－</button>
            ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="eliminarItem(${idx})">Eliminar</button>` : ""}
          </td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">Sin materiales que coincidan.</td></tr>`;
}

$("#inv-search").addEventListener("input", (e) => renderInventario(e.target.value));

$("#add-item-btn").addEventListener("click", () => {
  openModal("Nuevo material", [
    { name: "material", label: "Material", type: "text", required: true },
    { name: "stock", label: "Stock actual", type: "number", required: true, min: 0 },
    { name: "minimo", label: "Stock mínimo", type: "number", required: true, min: 0 },
    { name: "unidad", label: "Unidad", type: "text", required: true }
  ], (data) => {
    const inv = DB.getInventario();
    inv.push({
      material: data.material,
      stock: Number(data.stock),
      minimo: Number(data.minimo),
      unidad: data.unidad
    });
    DB.saveInventario(inv);
    renderInventario();
    toast("Material agregado", "ok");
  });
});

function ajustarStock(idx, delta) {
  const inv = DB.getInventario();
  if (!inv[idx]) return;
  inv[idx].stock = Math.max(0, inv[idx].stock + delta);
  DB.saveInventario(inv);
  renderInventario($("#inv-search").value);
}

function eliminarItem(idx) {
  const inv = DB.getInventario();
  if (!inv[idx]) return;
  if (!confirm(`¿Eliminar "${inv[idx].material}"?`)) return;
  inv.splice(idx, 1);
  DB.saveInventario(inv);
  renderInventario($("#inv-search").value);
  toast("Material eliminado", "err");
}

/* ---------------------- REPORTES ---------------------- */
function renderReportes() {
  const ord = DB.getOrdenes();
  const totalUnidades = ord.reduce((s, o) => s + o.cantidad, 0);
  const completadas = ord.filter((o) => o.estado === "completada");
  const unidadesComp = completadas.reduce((s, o) => s + o.cantidad, 0);
  const cumplimiento = ord.length ? Math.round((completadas.length / ord.length) * 100) : 0;

  $("#report-cards").innerHTML = `
    ${kpi("Unidades planificadas", totalUnidades, "Suma de todas las órdenes")}
    ${kpi("Unidades completadas", unidadesComp, "Producción finalizada", "ok")}
    ${kpi("Cumplimiento", cumplimiento + "%", "Órdenes completadas / totales", cumplimiento >= 50 ? "ok" : "warn")}
  `;

  // Producción por producto
  const porProd = {};
  ord.forEach((o) => (porProd[o.producto] = (porProd[o.producto] || 0) + o.cantidad));
  const max = Math.max(...Object.values(porProd), 1);
  $("#report-bars").innerHTML = Object.entries(porProd)
    .sort((a, b) => b[1] - a[1])
    .map(([prod, cant]) => barRow(prod, Math.round((cant / max) * 100), cant))
    .join("");
}

/* ---------------------- MODAL GENÉRICO ---------------------- */
function openModal(title, fields, onSubmit) {
  $("#modal-title").textContent = title;
  const form = $("#modal-form");
  form.innerHTML =
    fields.map((f) => {
      if (f.type === "select") {
        return `<label>${f.label}</label>
          <select name="${f.name}">
            ${f.options.map((o) => `<option value="${o.v}">${o.t}</option>`).join("")}
          </select>`;
      }
      const attrs = [
        f.required ? "required" : "",
        f.min != null ? `min="${f.min}"` : ""
      ].join(" ");
      return `<label>${f.label}</label>
        <input type="${f.type}" name="${f.name}" ${attrs} />`;
    }).join("") +
    `<div class="modal-actions">
       <button type="submit" class="btn btn-primary btn-block">Guardar</button>
       <button type="button" class="btn btn-secondary btn-block" id="modal-cancel">Cancelar</button>
     </div>`;

  $("#modal").hidden = false;

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {};
    fields.forEach((f) => (data[f.name] = form.elements[f.name].value));
    closeModal();
    onSubmit(data);
  };
  $("#modal-cancel").onclick = closeModal;
}

function closeModal() { $("#modal").hidden = true; }
$("#modal-close").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

/* Exponer funciones usadas desde atributos onclick */
window.avanzarOrden = avanzarOrden;
window.eliminarOrden = eliminarOrden;
window.ajustarStock = ajustarStock;
window.eliminarItem = eliminarItem;
