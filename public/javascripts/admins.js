function deleteAdmin(adminId) {
    $.ajax({
        url: '/admin/admins/' + adminId + '/delete-json',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({adminId}),
        type: 'POST',
        success: ((res) => {
            console.log("Result: ", res);
            $("#" + adminId).remove();
        }),
        error: ((error) => {
            console.log("Error", error);
        })
    })
}

function removeEmployee(employeeId) {
    $.ajax({
        url: '/admin/employee/' + employeeId + '/delete-json',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({employeeId}),
        type: 'POST',
        success: ((res) => {
            console.log("Result: ", res);
            $("#" + employeeId).remove();
        }),
        error: ((error) => {
            console.log("Error", error);
        })
    })
}