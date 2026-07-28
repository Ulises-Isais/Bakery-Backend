import pool from "../config/db.js";
import bcrypt from "bcrypt";

const hashExistingPasswords = async () => {
  try {
    console.log(process.env.DB_USER);
    // traer a todos los usuarios
    const [users] = await pool.query("SELECT id, password FROM usuarios");

    for (const user of users) {
      // Verificar si ya está hasheada
      if (user.password.length < 20) {
        const hashed = await bcrypt.hash(user.password, 10);
        // Actualizar la contraseña
        await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
          hashed,
          user.id,
        ]);
        console.log(`Usuario ${user.id} actualizado`);
      }
    }
    console.log("Todas las contraseñas han sido procesadas");
  } catch (error) {
    console.error(error);
  } finally {
    pool.end();
  }
};
hashExistingPasswords();
