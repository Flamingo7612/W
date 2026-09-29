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


console.log("✅ Supabase подключён");


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

                alert("Заполни все поля.");

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
                    "Проверь почту и подтверди email."
                );

            } else {

                alert(
                    "Регистрация успешна!"
                );

            }


            registerForm.reset();

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
// ПОКАЗ ЛИЧНОГО КАБИНЕТА
// ========================================

async function showUser() {

    const loading =
        document.getElementById("loading");


    const profile =
        document.getElementById("profile");


    // ========================================
    // ACCOUNT.HTML
    // ========================================

    if (loading && profile) {

        loading.style.display = "block";

        profile.style.display = "none";

    }


    console.log(
        "🔎 Проверяем сохранённую сессию..."
    );


    // ========================================
    // ПОЛУЧАЕМ SESSION
    // ========================================

    const {
        data: sessionData,
        error: sessionError
    } =
        await supabase.auth.getSession();


    console.log(
        "SESSION:",
        sessionData
    );


    console.log(
        "SESSION ERROR:",
        sessionError
    );


    if (sessionError) {

        console.error(
            sessionError
        );

        showNotLoggedIn(
            "Ошибка проверки авторизации."
        );

        return;
    }


    const session =
        sessionData
            ? sessionData.session
            : null;


    // ========================================
    // НЕТ СЕССИИ
    // ========================================

    if (!session) {

        console.log(
            "❌ Пользователь не вошёл."
        );


        showNotLoggedIn(
            "Вы не вошли в аккаунт."
        );


        return;
    }


    // ========================================
    // ПОЛЬЗОВАТЕЛЬ
    // ========================================

    const user =
        session.user;


    console.log(
        "✅ Пользователь найден:",
        user
    );


    // ========================================
    // ПОКАЗЫВАЕМ ПРОФИЛЬ
    // ========================================

    if (loading) {

        loading.style.display =
            "none";

    }


    if (profile) {

        profile.style.display =
            "block";

    }


    // ========================================
    // ДАННЫЕ
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


    if (
        infoDate &&
        user.created_at
    ) {

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
// ЕСЛИ НЕТ АВТОРИЗАЦИИ
// ========================================

function showNotLoggedIn(
    message
) {

    const loading =
        document.getElementById(
            "loading"
        );


    const profile =
        document.getElementById(
            "profile"
        );


    if (profile) {

        profile.style.display =
            "none";

    }


    if (loading) {

        loading.style.display =
            "block";


        loading.innerHTML = `

            <div style="
                background:white;
                padding:30px;
                border-radius:18px;
                border:1px solid #d7e3da;
                box-shadow:0 15px 40px rgba(18,61,42,.12);
            ">

                <div style="
                    font-size:42px;
                    margin-bottom:15px;
                ">
                    👤
                </div>

                <h2 style="
                    color:#123d2a;
                    margin-bottom:10px;
                ">
                    ${message}
                </h2>

                <p style="
                    color:#617066;
                    margin-bottom:20px;
                ">
                    Войдите в аккаунт, чтобы открыть личный кабинет.
                </p>

                <a
                    href="index.html"
                    style="
                        display:inline-block;
                        padding:13px 22px;
                        background:#d62828;
                        color:white;
                        border-radius:10px;
                        font-weight:bold;
                    "
                >
                    Вернуться на сайт
                </a>

            </div>

        `;

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


            if (!name) {

                showMessage(
                    "Введите имя.",
                    "error"
                );

                return;
            }


            console.log(
                "💾 Сохраняем профиль..."
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


            setTimeout(
                function() {

                    showUser();

                },
                300
            );

        }
    );

}


// ========================================
// СООБЩЕНИЯ
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


            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// ЗАПУСК
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

    }
);
