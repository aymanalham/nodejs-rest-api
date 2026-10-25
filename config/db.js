// أولًا:
// require("dotenv")
// يعني:
// حمّل مكتبة dotenv إلى البرنامج.
// وهي المكتبة التي تثبت أنها موجودة عندك بعد:
// npm install dotenv
// ثانيًا:
// .config()
// هذه هي التي تجعل dotenv يقرأ ملف:
// .env
// مثلاً ملف .env عندك يحتوي على شيء مثل:
// MONGO_URI=رابط_الاتصال
// بعد تشغيل:
// require("dotenv").config();
// يصبح بإمكاننا الوصول إليه بواسطة:
// process.env.MONGO_URI
// وهذا بالضبط ما نستخدمه هنا:
// mongoose.connect(process.env.MONGO_URI);
// يعني باختصار:
// .env
//    ↓
// dotenv
//    ↓
// process.env.MONGO_URI
//    ↓
// mongoose.connect()
//    ↓
// MongoDB
// والفكرة المهمة: نضع رابط MongoDB في .env بدل أن نكتبه مباشرة داخل الكود، خصوصًا لأن الرابط قد يحتوي على كلمة مرور.

// نستورد mongoose
const mongoose = require("mongoose");

require("dotenv").config();
//أنشأنا دالة اسمها:
// connectDB
// وظيفتها الاتصاىحة ل بقاعدة البيانات.

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = connectDB;
