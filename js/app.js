/* =========================================================
   MGO RKK Identity
   Основная логика приложения
   ========================================================= */


// Основные элементы страницы

const employeeCard = document.getElementById("employeeCard");
const loadingScreen = document.getElementById("loadingScreen");
const notFoundScreen = document.getElementById("notFoundScreen");
const errorScreen = document.getElementById("errorScreen");

const employeeName = document.getElementById("employeeName");
const employeePosition = document.getElementById("employeePosition");
const employeeRole = document.getElementById("employeeRole");

const employeeCredentialNumber = document.getElementById(
    "employeeCredentialNumber"
);

const employeeMemberNumber = document.getElementById(
    "employeeMemberNumber"
);

const employeeExpirationDate = document.getElementById(
    "employeeExpirationDate"
);

const employeeDepartment = document.getElementById(
    "employeeDepartment"
);

const employeePhone = document.getElementById("employeePhone");
const employeeEmail = document.getElementById("employeeEmail");
const employeePhoto = document.getElementById("employeePhoto");

const employeeBloodGroup = document.getElementById(
    "employeeBloodGroup"
);

const medicalRestrictionsItem = document.getElementById(
    "medicalRestrictionsItem"
);

const employeeMedicalRestrictions = document.getElementById(
    "employeeMedicalRestrictions"
);

const credentialStatus = document.getElementById("credentialStatus");

const credentialStatusText = document.getElementById(
    "credentialStatusText"
);


// Получаем идентификатор сотрудника из адресной строки.
//
// Пример:
// index.html?id=TEST-001

function getEmployeeIdFromUrl() {
    const urlParameters = new URLSearchParams(window.location.search);
    const employeeId = urlParameters.get("id");

    if (employeeId && employeeId.trim()) {
        return employeeId.trim();
    }

    return APP_CONFIG.defaultEmployeeId;
}


// Скрываем все основные экраны.

function hideAllScreens() {
    employeeCard.hidden = true;
    loadingScreen.hidden = true;
    notFoundScreen.hidden = true;
    errorScreen.hidden = true;
}


// Показываем экран загрузки.

function showLoadingScreen() {
    hideAllScreens();
    loadingScreen.hidden = false;
}


// Показываем карточку сотрудника.

function showEmployeeCard() {
    hideAllScreens();
    employeeCard.hidden = false;
}


// Показываем сообщение «Сотрудник не найден».

function showNotFoundScreen() {
    hideAllScreens();
    notFoundScreen.hidden = false;
}


// Показываем сообщение об ошибке.

function showErrorScreen() {
    hideAllScreens();
    errorScreen.hidden = false;
}


// Собираем полное ФИО из отдельных полей.

function getFullName(employee) {
    return [
        employee.lastName,
        employee.firstName,
        employee.middleName
    ]
        .filter(Boolean)
        .join(" ");
}


// Заполняем карточку данными сотрудника.

function renderEmployee(employee) {
    const fullName = getFullName(employee);

    employeeName.textContent =
        fullName || "ФИО не указано";

    employeePosition.textContent =
        employee.position || "Должность не указана";

    employeeRole.textContent =
        employee.role || "Не указана";

    employeeCredentialNumber.textContent =
        employee.credentialNumber || "Не указан";

    employeeMemberNumber.textContent =
        employee.memberNumber || "Не указан";

    employeeExpirationDate.textContent =
        employee.expirationDate || "Не указан";

    employeeDepartment.textContent =
        employee.department || "Не указано";

    employeePhone.textContent =
        employee.phone || "Не указан";

    if (employee.phone) {
        employeePhone.href =
            `tel:${employee.phone.replace(/[^\d+]/g, "")}`;
    } else {
        employeePhone.removeAttribute("href");
    }

    employeeEmail.textContent =
        employee.email || "Не указана";

    if (employee.email) {
        employeeEmail.href = `mailto:${employee.email}`;
    } else {
        employeeEmail.removeAttribute("href");
    }

    employeePhoto.src =
        employee.photo || APP_CONFIG.defaultPhoto;

    employeePhoto.alt =
        `Фотография сотрудника: ${fullName || "ФИО не указано"}`;

    employeePhoto.onerror = function () {
        employeePhoto.onerror = null;
        employeePhoto.src = APP_CONFIG.defaultPhoto;
    };

    employeeBloodGroup.textContent =
        employee.bloodGroup || "Не указана";

    const medicalRestrictions =
        String(employee.medicalRestrictions || "").trim();

    if (medicalRestrictions) {
        employeeMedicalRestrictions.textContent =
            medicalRestrictions;

        medicalRestrictionsItem.hidden = false;
    } else {
        medicalRestrictionsItem.hidden = true;
    }

    renderStatus(employee.status);
}


// Оформляем статус удостоверения.

function renderStatus(status) {
    credentialStatus.classList.remove(
        "credential-status--active",
        "credential-status--suspended",
        "credential-status--revoked",
        "credential-status--unknown"
    );

    switch (status) {
        case "active":
            credentialStatus.classList.add(
                "credential-status--active"
            );

            credentialStatusText.textContent =
                "Удостоверение действительно";
            break;

        case "suspended":
            credentialStatus.classList.add(
                "credential-status--suspended"
            );

            credentialStatusText.textContent =
                "Действие временно приостановлено";
            break;

        case "revoked":
            credentialStatus.classList.add(
                "credential-status--revoked"
            );

            credentialStatusText.textContent =
                "Удостоверение аннулировано";
            break;

        default:
            credentialStatus.classList.add(
                "credential-status--unknown"
            );

            credentialStatusText.textContent =
                "Статус не определен";
    }
}


// Загружаем сведения о сотруднике.

async function initializeApplication() {
    showLoadingScreen();

    const employeeId = getEmployeeIdFromUrl();

    try {
        const employee = await getEmployeeById(employeeId);

        if (!employee) {
            showNotFoundScreen();
            return;
        }

        renderEmployee(employee);
        showEmployeeCard();

    } catch (error) {
        console.error(
            "Не удалось загрузить данные сотрудника:",
            error
        );

        showErrorScreen();
    }
}


// Запускаем приложение.

initializeApplication();