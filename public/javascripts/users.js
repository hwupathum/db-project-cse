function getUrlVars() {
    let vars = [], hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$("#departmentSelect").change(function () {
    const department = this.value;
    location.href = '/reports/department/' + department;
});

$("#jobSelect1").change(function () {
    const {department, emp_status, paygrade} = getUrlVars();
    const job = this.value;
    location.href = `/reports/group?job=${job}&department=${department}&emp_status=${emp_status}&paygrade=${paygrade}`;
});

$("#departmentSelect1").change(function () {
    const {job, emp_status, paygrade} = getUrlVars();
    const department = this.value;
    location.href = `/reports/group?job=${job}&department=${department}&emp_status=${emp_status}&paygrade=${paygrade}`;
});

$("#emp_statusSelect1").change(function () {
    const {department, job, paygrade} = getUrlVars();
    const emp_status = this.value;
    location.href = `/reports/group?job=${job}&department=${department}&emp_status=${emp_status}&paygrade=${paygrade}`;
});

$("#paygradeSelect1").change(function () {
    const {job, emp_status, department} = getUrlVars();
    const paygrade = this.value;
    location.href = `/reports/group?job=${job}&department=${department}&emp_status=${emp_status}&paygrade=${paygrade}`;
});