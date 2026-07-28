import jwt from "jsonwebtoken";

export const generarJWT = (id, username, role, turno) => {
  return new Promise((resolve, reject) => {
    const payload = { uid: id, username, role, turno };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};
