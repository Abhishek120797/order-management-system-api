import sequelizeInstance from "./sequelizeInstance.js";
import User from "../models/User.model.js";
import associateModels from "../models/associations.js";

const connectDB = async () => {
    try {
        await sequelizeInstance.authenticate();
        console.log("Connection has been established successfully.");

        associateModels();
        console.log("Association done");

        await sequelizeInstance.sync({ alter: true });
        console.log("All model syncronized");

        await init();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

async function init() {
    try {
        let admin = await User.findOne({ where: { role: "ADMIN" } });
        if (admin) {
            console.log("admin is already present");
            return;
        }
    } catch (error) {
        console.log("Error while finding the admin data : ", error);
    }

    try {
        const admin = await User.create({
            firstName: "Vicky",
            lastName: "Jaiswal",
            email: process.env.ADMIN_EMAIL,
            contact: process.env.ADMIN_CONTACT,
            password: process.env.ADMIN_PASSWORD,
            role: "ADMIN",
            isVerified: true,
        });
        console.log("admin created ", admin);
    } catch (error) {
        console.log("Error while creating admin : ", error);
    }
}

export default connectDB;
