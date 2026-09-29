// ========================================
// SUPABASE
// ========================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL =
    "https://ybburxmftucnvulwhivr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_O55qe_bIpjXjllD1ODWVjA_dnE91yvC";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// ПРОВЕРКА SUPABASE
// ========================================

console.log("Supabase подключён");


// ========================================
// РЕГИСТРАЦИЯ
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("Начинаем регистрацию...");


            // Получаем данные
            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            console.log("Имя:", name);
            console.log("Email:", email);


            // Проверка
            if (!name || !email || !password) {

                alert(
                    "Заполни все поля."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Пароль должен содержать минимум 6 символов."
                );

                return;
            }


            // ========================================
            // СОЗДАЁМ ПОЛЬЗОВАТЕЛЯ
            // ========================================

            const {
                data,
                error
            } =
                await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            name: name
                        }

                    }

                });


            // Выводим ответ в консоль
            console.log(
                "SIGN UP DATA:",
                data
            );

            console.log(
                "SIGN UP ERROR:",
                error
            );


            // ========================================
            // ОШИБКА
            // ========================================

            if (error) {

                console.error(
                    "Ошибка регистрации:",
                    error
                );

                alert(
                    "Ошибка регистрации:\n\n" +
                    error.message
                );

                return;
            }


            // ========================================
            // SUPABASE НЕ ВЕРНУЛ USER
            // ========================================

            if (
                !data ||
                !data.user
            ) {

                console.error(
                    "Supabase не вернул пользователя.",
                    data
                );

                alert(
                    "Supabase не вернул пользователя.\n\n" +
                    "Открой Console браузера и посмотри результат."
                );

                return;
            }


            // ========================================
            // ПОЛЬЗОВАТЕЛЬ СОЗДАН
            // ========================================

            console.log(
                "Пользователь создан:",
                data.user
            );


            // Если подтверждение email включено
            if (!data.session) {

                alert(
                    "Регистрация выполнена!\n\n" +
                    "Пользователь создан в Supabase.\n\n" +
                    "Теперь проверь почту и подтверди email."
                );

            } else {

                alert(
                    "Регистрация успешна!\n\n" +
                    "Добро пожаловать, " +
                    name +
                    "!"
                );

            }


            // Очищаем форму
            registerForm.reset();


            // Показываем аккаунт
            showUser();

        }
    );

}


// ========================================
// ВХОД
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            if (!email || !password) {

                alert(
                    "Заполни email и пароль."
                );

                return;
            }


            console.log(
                "Попытка входа:",
                email
            );


            // ========================================
            // ВХОД
            // ========================================

            const {
                data,
                error
            } =
                await supabase.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            console.log(
                "LOGIN DATA:",
                data
            );

            console.log(
                "LOGIN ERROR:",
                error
            );


            if (error) {

                console.error(
                    "Ошибка входа:",
                    error
                );

                alert(
                    "Ошибка входа:\n\n" +
                    error.message
                );

                return;
            }


            alert(
                "Вы успешно вошли!"
            );


            loginForm.reset();


            showUser();

        }
    );

}


// ========================================
// ВЫХОД
// ========================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {


            const {
                error
            } =
                await supabase.auth.signOut();


            if (error) {

                console.error(
                    "Ошибка выхода:",
                    error
                );

                alert(
                    "Ошибка выхода:\n\n" +
                    error.message
                );

                return;
            }


            alert(
                "Вы вышли из аккаунта."
            );


            showUser();

        }
    );

}


// ========================================
// ПОКАЗ ПОЛЬЗОВАТЕЛЯ
// ========================================

async function showUser() {

    console.log(
        "Проверяем авторизацию..."
    );


    const {
        data,
        error
    } =
        await supabase.auth.getUser();


    console.log(
        "CURRENT USER:",
        data
    );


    if (error) {

        console.error(
            "Ошибка получения пользователя:",
            error
        );

    }


    const user =
        data
            ? data.user
            : null;


    // Элементы страницы
    const account =
        document.getElementById("account");


    const loginBlock =
        document.getElementById("loginBlock");


    const registerBlock =
        document.getElementById("registerBlock");


    const userName =
        document.getElementById("userName");


    const userEmail =
        document.getElementById("userEmail");


    // ========================================
    // ЕСЛИ ПОЛЬЗОВАТЕЛЬ ВОШЁЛ
    // ========================================

    if (user) {

        console.log(
            "Пользователь авторизован:",
            user.email
        );


        // Показываем кабинет
        if (account) {

            account.style.display =
                "block";

        }


        // Скрываем вход
        if (loginBlock) {

            loginBlock.style.display =
                "none";

        }


        // Скрываем регистрацию
        if (registerBlock) {

            registerBlock.style.display =
                "none";

        }


        // Получаем имя
        const name =
            user.user_metadata &&
            user.user_metadata.name
                ? user.user_metadata.name
                : "Пользователь";


        // Показываем имя
        if (userName) {

            userName.textContent =
                name;

        }


        // Показываем email
        if (userEmail) {

            userEmail.textContent =
                user.email || "";

        }

    }

    // ========================================
    // ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ ВОШЁЛ
    // ========================================

    else {

        console.log(
            "Пользователь не авторизован."
        );


        if (account) {

            account.style.display =
                "none";

        }


        if (loginBlock) {

            loginBlock.style.display =
                "block";

        }


        if (registerBlock) {

            registerBlock.style.display =
                "block";

        }

    }

}


// ========================================
// ПРОВЕРКА ПРИ ОТКРЫТИИ СТРАНИЦЫ
// ========================================

showUser();


// ========================================
// ОТСЛЕЖИВАНИЕ АВТОРИЗАЦИИ
// ========================================

supabase.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "AUTH EVENT:",
            event
        );

        console.log(
            "SESSION:",
            session
        );


        showUser();

    }
);
