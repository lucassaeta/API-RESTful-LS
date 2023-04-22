const bcryptjs = require("bcryptjs");
const encrypt = async (clearPassword) => {
  // segundo parametro es el salt
  const hash = await bcryptjs.hash(clearPassword, 10);
  return hash;
};
const compare = async (clearPassword, hashedPassword) => {
  // Compara entre la password en texto plano y su hash calculado anteriormente para decidir si coincide.
  const result = await bcryptjs.compare(clearPassword, hashedPassword);
  return result;
};
module.exports = { encrypt, compare };
