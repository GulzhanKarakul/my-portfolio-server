// Подключение необходимых модулей и библиотек
const express = require('express') // Подключение Express.js для работы с сервером
const router = express.Router(); // Создание роутера Express для обработки маршрутов
const cors = require("cors"); // Подключение модуля для обеспечения CORS (Cross-Origin Resource Sharing)
const nodemailer = require("nodemailer"); // Подключение модуля для отправки электронной почты
require('dotenv').config();
const functions = require("firebase-functions");
const PORT = process.env.PORT || 5000;

// Создание экземпляра приложения Express
const app = express();

// Использование CORS middleware для разрешения кросс-доменных запросов
app.use(cors());

// Парсинг JSON тела запроса
app.use(express.json());

// Использование роутера для маршрутизации запросов
app.use("/", router);

// Настройка прослушивания сервера на порту 5000
app.listen(PORT, () => console.log("Server Running"));

// Создание транспорта для отправки почты с помощью Nodemailer
const contactEmail = nodemailer.createTransport({
  service: 'gmail', // Указание сервиса для отправки почты (в данном случае, Gmail)
  host: "smtp.gmail.com",
    port: 465,
    secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Указание адреса электронной почты отправителя
    pass: process.env.EMAIL_PASS // Указание пароля электронной почты отправителя (лучше использовать переменные окружения)
  },
});

// Проверка подключения к почтовому сервису
contactEmail.verify((error) => {
  if (error) {
    console.log(error); // Вывод ошибки, если подключение не удалось
  } else {
    console.log("Ready to Send"); // Вывод сообщения о готовности к отправке почты
  }
});

// Маршрут для обработки POST запроса на эндпоинт '/contact'
router.post("/contact", (req, res) => {
  // Получение данных из тела POST запроса
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  
  // Формирование объекта письма
  const mail = {
    from: {
        name: `${name}`,
        address: process.env.EMAIL_USER,
    },
    to: "karakulgulzhan@gmail.com", // Кому
    subject: "Contact Form Submission - Portfolio", // Тема письма
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`, // HTML содержимое письма
  };
  
  // Отправка письма
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error); // Отправка ошибки в случае неудачной отправки письма
    } else {
      res.json({ code: 200, status: "Message Sent" }); // Отправка успешного статуса в случае успешной отправки письма
    }
  });
});

exports.api = functions.https.onRequest(app);
