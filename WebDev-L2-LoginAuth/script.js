const USERS_KEY = "secureAuthUsers";
const SESSION_KEY = "secureAuthSession";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function showMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `message ${type}`;
}

function setupPasswordToggle(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        } else {
            input.type = "password";
            button.textContent = "Show";
        }
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    const registerMessage = document.getElementById("registerMessage");

    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const username = document
            .getElementById("registerUsername")
            .value
            .trim();

        const email = document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!username || !email || !password || !confirmPassword) {
            showMessage(
                registerMessage,
                "Please fill in all fields.",
                "error"
            );
            return;
        }

        if (password.length < 8) {
            showMessage(
                registerMessage,
                "Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        if (!/\d/.test(password)) {
            showMessage(
                registerMessage,
                "Password must contain at least one number.",
                "error"
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(
                registerMessage,
                "Passwords do not match.",
                "error"
            );
            return;
        }

        const users = getUsers();

        const duplicateUser = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );

        if (duplicateUser) {
            showMessage(
                registerMessage,
                "An account with these details already exists.",
                "error"
            );
            return;
        }

        const passwordHash = await hashPassword(password);

        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            passwordHash: passwordHash
        };

        users.push(newUser);

        saveUsers(users);

        showMessage(
            registerMessage,
            "Registration successful! Redirecting to login...",
            "success"
        );

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const loginMessage = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            showMessage(
                loginMessage,
                "Please enter your email and password.",
                "error"
            );
            return;
        }

        const users = getUsers();

        const passwordHash = await hashPassword(password);

        const user = users.find(
            storedUser =>
                storedUser.email.toLowerCase() === email &&
                storedUser.passwordHash === passwordHash
        );

        if (!user) {
            showMessage(
                loginMessage,
                "Invalid email or password.",
                "error"
            );
            return;
        }

        const session = {
            userId: user.id,
            username: user.username,
            email: user.email
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );

        window.location.href = "dashboard.html";
    });
}

const dashboardUsername =
    document.getElementById("dashboardUsername");

if (dashboardUsername) {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );

    if (!session) {
        window.location.href = "index.html";
    } else {
        dashboardUsername.textContent = session.username;
        document.getElementById("dashboardEmail").textContent =
            session.email;
    }
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    });
}

setupPasswordToggle(
    "toggleLoginPassword",
    "loginPassword"
);

setupPasswordToggle(
    "toggleRegisterPassword",
    "registerPassword"
);