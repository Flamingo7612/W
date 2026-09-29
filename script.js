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


            const { error } =
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

                    message.style.display =
                        "block";

                }

                return;
            }


            if (message) {

                message.textContent =
                    "Регистрация успешна! Проверьте вашу почту.";

                message.className =
                    "message success";

                message.style.display =
                    "block";

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


            const { error } =
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

                    message.style.display =
                        "block";

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


    await loadOrders(user.id);
}


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

                    message.style.display =
                        "block";

                }

                return;
            }


            if (message) {

                message.textContent =
                    "Профиль успешно сохранён!";

                message.className =
                    "message success";

                message.style.display =
                    "block";

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
// СОЗДАНИЕ И ОТПРАВКА ЗАКАЗА
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

                message.style.display =
                    "block";

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


            button.disabled =
                true;

            button.textContent =
                "⏳ Сохраняем заказ...";


            message.textContent =
                "";

            message.style.display =
                "none";


            try {

                // ==================================
                // СОХРАНЯЕМ ЗАКАЗ
                // ==================================

                const {
                    data: order,
                    error: insertError
                } =
                    await supabase
                        .from("orders")
                        .insert({

                            user_id:
                                user.id,

                            name:
                                name,

                            email:
                                email,

                            phone:
                                phone || null,

                            service:
                                service,

                            description:
                                description || null,

                            preferred_date:
                                date || null

                        })
                        .select()
                        .single();


                if (insertError) {
                    throw insertError;
                }


                // ==================================
                // TELEGRAM
                // ==================================

                button.textContent =
                    "📱 Отправляем...";


                const {
                    error: telegramError
                } =
                    await supabase.functions.invoke(
                        "send-order",
                        {

                            body: {

                                order_id:
                                    order.id,

                                name:
                                    name,

                                email:
                                    email,

                                phone:
                                    phone,

                                service:
                                    service,

                                description:
                                    description,

                                preferred_date:
                                    date

                            }

                        }
                    );


                if (telegramError) {
                    throw telegramError;
                }


                // ==================================
                // УСПЕШНО
                // ==================================

                message.textContent =
                    `✅ Заказ №${order.id} успешно отправлен! Мы свяжемся с вами.`;

                message.className =
                    "success";

                message.style.display =
                    "block";

                message.hidden =
                    false;


                orderForm.reset();


                if (phone) {

                    const orderPhoneInput =
                        document.getElementById(
                            "orderPhone"
                        );

                    if (orderPhoneInput) {
                        orderPhoneInput.value =
                            phone;
                    }

                }


                await loadOrders(user.id);


            } catch (error) {

                console.error(
                    "Ошибка заказа:",
                    error
                );


                message.textContent =
                    "❌ Не удалось отправить заказ. Попробуйте ещё раз.";

                message.className =
                    "error";

                message.style.display =
                    "block";

                message.hidden =
                    false;

            }


            button.disabled =
                false;

            button.textContent =
                "📩 Отправить заказ";

        }
    );

}


// ==========================================
// МОИ ЗАКАЗЫ
// ==========================================

async function loadOrders(userId) {

    const ordersList =
        document.getElementById(
            "ordersList"
        );


    if (!ordersList) {
        return;
    }


    ordersList.innerHTML =
        "<p>⏳ Загружаем заказы...</p>";


    const {
        data: orders,
        error
    } =
        await supabase
            .from("orders")
            .select("*")
            .eq("user_id", userId)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Ошибка загрузки заказов:",
            error
        );

        ordersList.innerHTML =
            "<p>❌ Не удалось загрузить заказы.</p>";

        return;
    }


    if (!orders || orders.length === 0) {

        ordersList.innerHTML = `
            <div class="empty-orders">
                <div style="font-size:40px;">
                    📦
                </div>

                <p>
                    У вас пока нет заказов.
                </p>
            </div>
        `;

        return;
    }


    ordersList.innerHTML =
        orders.map(
            function(order) {

                const createdDate =
                    new Date(
                        order.created_at
                    ).toLocaleDateString(
                        "ru-RU"
                    );


                let statusClass =
                    "status-new";


                if (
                    order.status ===
                    "В работе"
                ) {
                    statusClass =
                        "status-work";
                }


                if (
                    order.status ===
                    "Выполнен"
                ) {
                    statusClass =
                        "status-done";
                }


                if (
                    order.status ===
                    "Отменён"
                ) {
                    statusClass =
                        "status-cancel";
                }


                return `
                    <div class="order-history-card">

                        <div class="order-history-top">

                            <strong>
                                Заказ №${order.id}
                            </strong>

                            <span class="${statusClass}">
                                ${getStatusIcon(order.status)}
                                ${order.status}
                            </span>

                        </div>


                        <div class="order-history-service">
                            🔧 ${escapeHtml(order.service)}
                        </div>


                        <div class="order-history-date">
                            📅 Желаемая дата:
                            ${
                                order.preferred_date
                                    ? escapeHtml(
                                        formatDate(
                                            order.preferred_date
                                        )
                                    )
                                    : "Не указана"
                            }
                        </div>


                        <div class="order-history-created">
                            🕒 Создан:
                            ${createdDate}
                        </div>


                        ${
                            order.description
                                ? `
                                    <div class="order-history-description">
                                        📝 ${escapeHtml(
                                            order.description
                                        )}
                                    </div>
                                  `
                                : ""
                        }

                    </div>
                `;

            }
        ).join("");

}


// ==========================================
// ИКОНКА СТАТУСА
// ==========================================

function getStatusIcon(status) {

    switch (status) {

        case "В работе":
            return "🔵";

        case "Выполнен":
            return "🟢";

        case "Отменён":
            return "🔴";

        default:
            return "🟡";

    }

}


// ==========================================
// ФОРМАТ ДАТЫ
// ==========================================

function formatDate(date) {

    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return (
        parts[2] +
        "." +
        parts[1] +
        "." +
        parts[0]
    );

}


// ==========================================
// ЗАЩИТА ОТ HTML
// ==========================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
