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


console.log("Supabase подключён");


// ========================================
// РЕГИСТРАЦИЯ
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


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


            console.log(
                "SIGN UP DATA:",
                data
            );

            console.log(
                "SIGN UP ERROR:",
                error
            );


            if (error) {

                alert(
                    "Ошибка регистрации:\n\n" +
                    error.message
                );

                return;
            }


            if (!data || !data.user) {

                alert(
                    "Supabase не вернул пользователя."
                );

                return;
            }


            if (!data.session) {

                alert(
                    "Регистрация выполнена!\n\n" +
                    "Проверьте почту и подтвердите email."
                );

            } else {

                alert(
                    "Регистрация успешна!"
                );

            }


            registerForm.reset();


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
        async function(event) {

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
// ЛИЧНЫЙ КАБИНЕТ
// ========================================

async function showUser() {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();


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


    // ========================================
    // ЭЛЕМЕНТЫ ACCOUNT.HTML
    // ========================================

    const loading =
        document.getElementById("loading");


    const profile =
        document.getElementById("profile");


    // ========================================
    // ЕСЛИ МЫ НА ACCOUNT.HTML
    // ========================================

    if (loading && profile) {

        loading.style.display = "none";


        if (!user) {

            profile.style.display = "none";


            loading.style.display = "block";


            loading.innerHTML = `
                <p style="margin-bottom:15px;">
                    Вы не вошли в аккаунт.
                </p>

                <a
                    href="index.html"
                    style="
                        display:inline-flex;
                        padding:13px 20px;
                        background:#d62828;
                        color:white;
                        border-radius:10px;
                        font-weight:bold;
                    "
                >
                    Вернуться на сайт
                </a>
            `;

            return;
        }


        profile.style.display = "block";


        // ========================================
        // ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
        // ========================================

        const metadata =
            user.user_metadata || {};


        const name =
            metadata.name ||
            "Пользователь";


        const phone =
            metadata.phone ||
            "";


        // ========================================
        // ИМЯ
        // ========================================

        const profileName =
            document.getElementById(
                "profileName"
            );


        const infoName =
            document.getElementById(
                "infoName"
            );


        const editName =
            document.getElementById(
                "editName"
            );


        if (profileName) {

            profileName.textContent =
                name;

        }


        if (infoName) {

            infoName.textContent =
                name;

        }


        if (editName) {

            editName.value =
                name;

        }


        // ========================================
        // EMAIL
        // ========================================

        const infoEmail =
            document.getElementById(
                "infoEmail"
            );


        if (infoEmail) {

            infoEmail.textContent =
                user.email || "—";

        }


        // ========================================
        // ТЕЛЕФОН
        // ========================================

        const infoPhone =
            document.getElementById(
                "infoPhone"
            );


        const editPhone =
            document.getElementById(
                "editPhone"
            );


        if (infoPhone) {

            infoPhone.textContent =
                phone || "Не указан";

        }


        if (editPhone) {

            editPhone.value =
                phone;

        }


        // ========================================
        // АВАТАР
        // ========================================

        const avatar =
            document.getElementById(
                "avatar"
            );


        if (avatar) {

            avatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();

        }


        // ========================================
        // ДАТА РЕГИСТРАЦИИ
        // ========================================

        const infoDate =
            document.getElementById(
                "infoDate"
            );


        if (infoDate && user.created_at) {

            const date =
                new Date(
                    user.created_at
                );


            infoDate.textContent =
                date.toLocaleDateString(
                    "ru-RU",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );

        }

    }


    // ========================================
    // СТАРЫЙ БЛОК ACCOUNT
    // ДЛЯ СОВМЕСТИМОСТИ
    // ========================================

    const oldAccount =
        document.getElementById("account");


    const loginBlock =
        document.getElementById("loginBlock");


    const registerBlock =
        document.getElementById("registerBlock");


    const userName =
        document.getElementById("userName");


    const userEmail =
        document.getElementById("userEmail");


    if (user) {

        if (oldAccount) {

            oldAccount.style.display =
                "block";

        }


        if (loginBlock) {

            loginBlock.style.display =
                "none";

        }


        if (registerBlock) {

            registerBlock.style.display =
                "none";

        }


        if (userName) {

            userName.textContent =
                user.user_metadata?.name ||
                "Пользователь";

        }


        if (userEmail) {

            userEmail.textContent =
                user.email || "";

        }

    } else {

        if (oldAccount) {

            oldAccount.style.display =
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
// СОХРАНЕНИЕ ПРОФИЛЯ
// ========================================

const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("editName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("editPhone")
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "message"
                );


            if (!name) {

                showMessage(
                    "Введите имя.",
                    "error"
                );

                return;
            }


            console.log(
                "Сохраняем профиль..."
            );


            const {
                data,
                error
            } =
                await supabase.auth.updateUser({

                    data: {

                        name: name,

                        phone: phone

                    }

                });


            console.log(
                "UPDATE DATA:",
                data
            );


            console.log(
                "UPDATE ERROR:",
                error
            );


            if (error) {

                console.error(
                    error
                );


                showMessage(
                    "Ошибка сохранения: " +
                    error.message,
                    "error"
                );

                return;
            }


            showMessage(
                "Профиль успешно сохранён!",
                "success"
            );


            showUser();

        }
    );

}


// ========================================
// СООБЩЕНИЕ
// ========================================

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        "message " + type;


    setTimeout(
        function() {

            message.className =
                "message";

        },
        4000
    );

}


// ========================================
// ВЫХОД
// ========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {


            const {
                error
            } =
                await supabase.auth.signOut();


            if (error) {

                alert(
                    "Ошибка выхода:\n\n" +
                    error.message
                );

                return;
            }


            alert(
                "Вы вышли из аккаунта."
            );


            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// ПРОВЕРКА ПРИ ЗАПУСКЕ
// ========================================

showUser();


// ========================================
// ОТСЛЕЖИВАНИЕ АВТОРИЗАЦИИ
// ========================================

supabase.auth.onAuthStateChange(
    function(event, session) {

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
