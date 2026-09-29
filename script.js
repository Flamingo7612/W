import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://ybburxmftucnvulwhivr.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYnVyeG1mdHVjbnZ1bHdoaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDc0MDIsImV4cCI6MjEwNjI4MzQwMn0.ECJGi8AsUqvWL_NdCgq2OFEu3uGee7uuGECwvnCDk8U";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ========================================
// РЕГИСТРАЦИЯ
// ========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        if (!name || !email || !password) {
            alert("Заполни все поля");
            return;
        }

        if (password.length < 6) {
            alert("Пароль должен быть минимум 6 символов");
            return;
        }

        const { data, error } =
            await supabase.auth.signUp({

                email: email,
                password: password,

                options: {
                    data: {
                        name: name
                    }
                }

            });


        if (error) {

            console.error(error);

            alert(
                "Ошибка регистрации:\n" +
                error.message
            );

            return;
        }


        alert(
            "Регистрация выполнена!\n\n" +
            "Если требуется подтверждение email, " +
            "проверь почту."
        );

        registerForm.reset();

    });

}


// ========================================
// ВХОД
// ========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,
                password: password

            });


        if (error) {

            console.error(error);

            alert(
                "Ошибка входа:\n" +
                error.message
            );

            return;
        }


        alert("Вы успешно вошли!");

        loginForm.reset();

        showUser();

    });

}


// ========================================
// ВЫХОД
// ========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        const { error } =
            await supabase.auth.signOut();


        if (error) {

            alert(
                "Ошибка выхода:\n" +
                error.message
            );

            return;
        }


        alert("Вы вышли из аккаунта");

        showUser();

    });

}


// ========================================
// ПОКАЗ ПОЛЬЗОВАТЕЛЯ
// ========================================

async function showUser() {

    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();


    const account =
        document.getElementById("account");

    const loginBlock =
        document.getElementById("loginBlock");

    const registerBlock =
        document.getElementById("registerBlock");


    if (user) {

        if (account) {
            account.style.display = "block";
        }

        if (loginBlock) {
            loginBlock.style.display = "none";
        }

        if (registerBlock) {
            registerBlock.style.display = "none";
        }


        const name =
            user.user_metadata?.name ||
            "Пользователь";


        const userName =
            document.getElementById("userName");

        const userEmail =
            document.getElementById("userEmail");


        if (userName) {
            userName.textContent = name;
        }

        if (userEmail) {
            userEmail.textContent = user.email;
        }

    } else {

        if (account) {
            account.style.display = "none";
        }

        if (loginBlock) {
            loginBlock.style.display = "block";
        }

        if (registerBlock) {
            registerBlock.style.display = "block";
        }

    }

}


// ========================================
// ПРОВЕРКА ПРИ ОТКРЫТИИ
// ========================================

showUser();


// ========================================
// ОТСЛЕЖИВАНИЕ АВТОРИЗАЦИИ
// ========================================

supabase.auth.onAuthStateChange(() => {

    showUser();

});
