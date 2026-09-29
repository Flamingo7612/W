import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ybburxmftucnvulwhivr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_O55qe_bIpjXjllD1ODWVjA_dnE91yvC";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// РЕГИСТРАЦИЯ
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const name =
                document.getElementById("registerName")?.value.trim();

            const email =
                document.getElementById("registerEmail")?.value.trim();

            const password =
                document.getElementById("registerPassword")?.value;

            const phone =
                document.getElementById("registerPhone")?.value.trim();

            const message =
                document.getElementById("registerMessage");

            const { data, error } =
                await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {
                        data: {
                            name: name,
                            phone: phone
                        }
                    }

                });


            if (error) {

                if (message) {

                    message.textContent =
                        "Ошибка: " + error.message;

                    message.className =
                        "message error";

                }

                return;
            }


            if (message) {

                message.textContent =
                    "Регистрация успешна! Проверьте вашу почту.";

                message.className =
                    "message success";

            }

        }
    );

}


// ==========================================
// ВХОД
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail")?.value.trim();

            const password =
                document.getElementById("loginPassword")?.value;

            const message =
                document.getElementById("loginMessage");


            const { data, error } =
                await supabase.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                if (message) {

                    message.textContent =
                        "Ошибка: " + error.message;

                    message.className =
                        "message error";

                }

                return;
            }


            window.location.href =
                "account.html";

        }
    );

}


// ==========================================
// ЛИЧНЫЙ КАБИНЕТ
// ==========================================

async function showUser() {

    const loading =
        document.getElementById("loading");

    const profile =
        document.getElementById("profile");


    if (!loading || !profile) {
        return;
    }


    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();


    if (!session) {

        loading.innerHTML = `
            <div class="message error"
                 style="display:block">

                Вы не вошли в аккаунт.

                <br><br>

                <a href="index.html">
                    Вернуться на главную
                </a>

            </div>
        `;

        return;
    }


    const user =
        session.user;


    const name =
        user.user_metadata?.name ||
        "Пользователь";


    const phone =
        user.user_metadata?.phone ||
        "Не указан";


    const email =
        user.email ||
        "Не указан";


    const date =
        user.created_at
            ? new Date(user.created_at)
                .toLocaleDateString("ru-RU")
            : "—";


    const profileName =
        document.getElementById("profileName");

    const infoName =
        document.getElementById("infoName");

    const infoEmail =
        document.getElementById("infoEmail");

    const infoPhone =
        document.getElementById("infoPhone");

    const infoDate =
        document.getElementById("infoDate");

    const avatar =
        document.getElementById("avatar");

    const editName =
        document.getElementById("editName");

    const editPhone =
        document.getElementById("editPhone");

    const orderPhone =
        document.getElementById("orderPhone");


    if (profileName)
        profileName.textContent = name;

    if (infoName)
        infoName.textContent = name;

    if (infoEmail)
        infoEmail.textContent = email;

    if (infoPhone)
        infoPhone.textContent = phone;

    if (infoDate)
        infoDate.textContent = date;

    if (avatar)
        avatar.textContent =
            name.charAt(0).toUpperCase();

    if (editName)
        editName.value = name;

    if (editPhone && phone !== "Не указан")
        editPhone.value = phone;

    if (orderPhone && phone !== "Не указан")
        orderPhone.value = phone;


    loading.style.display =
        "none";

    profile.style.display =
        "block";
}


// Запускаем кабинет
showUser();


// ==========================================
// СОХРАНЕНИЕ ПРОФИЛЯ
// ==========================================

const profileForm =
    document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById("editName")
                    ?.value.trim();


            const phone =
                document.getElementById("editPhone")
                    ?.value.trim();


            const message =
                document.getElementById("message");


            const {
                data,
                error
            } = await supabase.auth.updateUser({

                data: {
                    name: name,
                    phone: phone
                }

            });


            if (error) {

                if (message) {

                    message.textContent =
                        "Ошибка: " + error.message;

                    message.className =
                        "message error";

                }

                return;
            }


            if (message) {

                message.textContent =
                    "Профиль успешно сохранён!";

                message.className =
                    "message success";

            }


            await showUser();

        }
    );

}


// ==========================================
// ВЫХОД
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            await supabase.auth.signOut();

            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// МАСКА ТЕЛЕФОНА
// ==========================================

function setupPhoneMask(input) {

    if (!input) {
        return;
    }


    function formatPhone(value) {

        let digits =
            value.replace(/\D/g, "");


        if (digits.startsWith("8")) {

            digits =
                "7" + digits.substring(1);

        }


        if (!digits.startsWith("7")) {

            digits =
                "7" + digits;

        }


        digits =
            digits.substring(0, 11);


        const number =
            digits.substring(1);


        let result =
            "+7";


        if (number.length > 0) {

            result +=
                " (" +
                number.substring(0, 3);

        }


        if (number.length >= 3) {

            result += ")";

        }


        if (number.length > 3) {

            result +=
                " " +
                number.substring(3, 6);

        }


        if (number.length > 6) {

            result +=
                "-" +
                number.substring(6, 8);

        }


        if (number.length > 8) {

            result +=
                "-" +
                number.substring(8, 10);

        }


        return result;
    }


    input.addEventListener(
        "focus",
        function() {

            if (input.value === "") {

                input.value =
                    "+7 ";

            }

        }
    );


    input.addEventListener(
        "input",
        function() {

            input.value =
                formatPhone(input.value);

        }
    );


    input.addEventListener(
        "paste",
        function() {

            setTimeout(
                function() {

                    input.value =
                        formatPhone(input.value);

                },
                0
            );

        }
    );


    if (input.value) {

        input.value =
            formatPhone(input.value);

    }

}


setupPhoneMask(
    document.getElementById("editPhone")
);

setupPhoneMask(
    document.getElementById("orderPhone")
);


// ==========================================
// ОТПРАВКА ЗАКАЗА В TELEGRAM
// ==========================================

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const button =
                orderForm.querySelector(
                    ".order-button"
                );


            const message =
                document.getElementById(
                    "orderMessage"
                );


            const service =
                document.getElementById(
                    "orderService"
                )?.value;


            const phone =
                document.getElementById(
                    "orderPhone"
                )?.value.trim();


            const date =
                document.getElementById(
                    "orderDate"
                )?.value;


            const description =
                document.getElementById(
                    "orderDescription"
                )?.value.trim();


            // Получаем текущего пользователя
            const {
                data: {
                    session
                }
            } =
                await supabase.auth.getSession();


            if (!session) {

                message.textContent =
                    "Сначала войдите в личный кабинет.";

                message.className =
                    "error";

                return;
            }


            const user =
                session.user;


            const name =
                user.user_metadata?.name ||
                "Не указан";


            const email =
                user.email ||
                "Не указан";


            // Блокируем кнопку
            button.disabled =
                true;

            button.textContent =
                "⏳ Отправляем...";


            message.style.display =
                "none";


            try {

                const {
                    data,
                    error
                } =
                    await supabase.functions.invoke(
                        "send-order",
                        {

                            body: {

                                name: name,

                                email: email,

                                phone: phone,

                                service: service,

                                description: description,

                                preferred_date: date

                            }

                        }
                    );


                if (error) {
                    throw error;
                }


                if (
                    !data ||
                    data.success !== true
                ) {

                    throw new Error(
                        data?.error ||
                        "Не удалось отправить заказ"
                    );

                }


                message.textContent =
                    "✅ Заказ успешно отправлен! Мы свяжемся с вами.";

                message.className =
                    "success";


                orderForm.reset();


                // После reset снова подставляем телефон
                if (phone) {

                    document.getElementById(
                        "orderPhone"
                    ).value = phone;

                }


            } catch (error) {

                console.error(
                    "Ошибка заказа:",
                    error
                );


                message.textContent =
                    "❌ Не удалось отправить заказ. Попробуйте ещё раз.";

                message.className =
                    "error";

            }


            button.disabled =
                false;

            button.textContent =
                "📩 Отправить заказ";

        }
    );

}
