import Role from "../model/rolesModel";

export const getAllRole = async (req, res) => {
  try {
    const role = await Role.findAll({
      attributes: ["id", "name"],
    });
    console.log(role);
    res.json(role);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};
