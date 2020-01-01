$("#departmentSelect").change(function () {
    var department = this.value;
    location.href = '/reports/department/' + department;
});