/* ============================================================
   data.js — Datos de ejemplo (semilla) del aplicativo ProduTech
   Simulan la "base de datos" del estudio de caso. Al primer uso
   se cargan en localStorage; luego persisten los cambios reales.
   ============================================================ */

const SEED_USERS = {
  admin:    { pass: "1234", name: "Ana Restrepo",  role: "admin",    roleLabel: "Personal administrativo" },
  operario: { pass: "1234", name: "Carlos Díaz",   role: "operario", roleLabel: "Empleado (producción)" }
};

const SEED_ORDENES = [
  { id: "OP-1001", producto: "Panel de aluminio A1", cantidad: 120, responsable: "Carlos Díaz",   limite: "2026-09-25", estado: "proceso" },
  { id: "OP-1002", producto: "Perfil estructural PE3", cantidad: 300, responsable: "Marta Gómez",   limite: "2026-09-22", estado: "pendiente" },
  { id: "OP-1003", producto: "Bisagra reforzada BR2", cantidad: 500, responsable: "Carlos Díaz",   limite: "2026-09-19", estado: "completada" },
  { id: "OP-1004", producto: "Panel de aluminio A1", cantidad: 80,  responsable: "Luis Peña",     limite: "2026-09-28", estado: "pendiente" },
  { id: "OP-1005", producto: "Tornillo de precisión TP7", cantidad: 1000, responsable: "Marta Gómez", limite: "2026-09-20", estado: "proceso" },
  { id: "OP-1006", producto: "Bisagra reforzada BR2", cantidad: 250, responsable: "Luis Peña",     limite: "2026-09-30", estado: "completada" }
];

const SEED_INVENTARIO = [
  { material: "Lámina de aluminio",   stock: 45,  minimo: 60,  unidad: "kg" },
  { material: "Acero inoxidable",     stock: 210, minimo: 100, unidad: "kg" },
  { material: "Tornillos M6",         stock: 15,  minimo: 200, unidad: "cajas" },
  { material: "Pintura anticorrosiva",stock: 30,  minimo: 25,  unidad: "L" },
  { material: "Resina epóxica",       stock: 8,   minimo: 20,  unidad: "L" },
  { material: "Empaques de caucho",   stock: 500, minimo: 150, unidad: "und" }
];

/* Acceso a datos con persistencia en localStorage */
const DB = {
  init() {
    if (!localStorage.getItem("pt_ordenes"))
      localStorage.setItem("pt_ordenes", JSON.stringify(SEED_ORDENES));
    if (!localStorage.getItem("pt_inventario"))
      localStorage.setItem("pt_inventario", JSON.stringify(SEED_INVENTARIO));
  },
  users() { return SEED_USERS; },
  getOrdenes()  { return JSON.parse(localStorage.getItem("pt_ordenes")  || "[]"); },
  getInventario(){ return JSON.parse(localStorage.getItem("pt_inventario") || "[]"); },
  saveOrdenes(d)   { localStorage.setItem("pt_ordenes", JSON.stringify(d)); },
  saveInventario(d){ localStorage.setItem("pt_inventario", JSON.stringify(d)); },
  reset() { localStorage.removeItem("pt_ordenes"); localStorage.removeItem("pt_inventario"); this.init(); }
};
