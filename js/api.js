/* =========================================================
   MGO RKK Identity
   Получение данных сотрудника
   ========================================================= */


/*
   Временная тестовая база.

   Позже этот объект будет заменен запросом
   к Google Apps Script.
*/

const TEST_EMPLOYEES = {
    "TEST-001": {
        id: "TEST-001",

        lastName: "Конова",
        firstName: "Ксения",
        middleName: "Андреевна",

        position:
            "Исполнительный директор",

        role: "Штаб МГО",

        department:
            "Московское городское отделение",

        credentialNumber: "77-001245",

        memberNumber: "24043665",

        expirationDate: "31.12.2028",

        status: "active",

        phone: "+7 (917) 562-82-71",

        email: "konova@kor.ru",

        photo: APP_CONFIG.defaultPhoto,

        bloodGroup: "B(III) Rh+",

        medicalRestrictions:
            "Гемофобия"
    }
};


/*
   Получение сотрудника по идентификатору.
*/

async function getEmployeeById(employeeId) {

    /*
       Пока адрес API не указан,
       используем тестовые данные.
    */

    if (!APP_CONFIG.apiUrl) {
        return TEST_EMPLOYEES[employeeId] || null;
    }


    /*
       Этот код начнет работать после подключения
       Google Apps Script.
    */

    const requestUrl =
        `${APP_CONFIG.apiUrl}?id=${encodeURIComponent(employeeId)}`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
        throw new Error(
            `Ошибка загрузки данных: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        return null;
    }

    return result.employee;
}