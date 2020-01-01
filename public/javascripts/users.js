$("#departmentSelect").change(function () {
    var department = this.value;
    location.href = '/reports/department/' + department;
});

$("#jobSelect").change(function () {
    var job = this.value;
    location.href = '/reports/job/' + job;
});