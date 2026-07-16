import pool from "../config/db.js";

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
         SELECT id_categoria, nombre 
            FROM categorias
            where id_categoria IN (1,2 ,3)
            ORDER BY  id_categoria ASC
            
            
        `,
    );
    return res.status(200).json({
      ok: true,
      categorias: rows,
    });
  } catch (error) {
    console.error("Error en getCategorias:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener categorías",
    });
  }
};
