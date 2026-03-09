let students = JSON.parse(localStorage.getItem("students")) || [];
let chart;
function saveStudents(){
localStorage.setItem("students", JSON.stringify(students));
}
function getGrade(marks){
marks = Number(marks);
if(marks >= 90) return "A";
if(marks >= 75) return "B";
if(marks >= 60) return "C";
if(marks >= 50) return "D";
return "F";
}
function addStudent(){
let name = document.getElementById("name").value.trim();
let id = document.getElementById("studentId").value.trim();
let marks = document.getElementById("marks").value;
if(name === "" || id === "" || marks === ""){
alert("Please fill all fields");
return;
}
let exists = students.some(student => student.id === id);
if(exists){
alert("Roll number already exists");
return;
}
let student = {
name:name,
id:id,
marks:marks
};
students.push(student);
saveStudents();
displayStudents();
updateChart();
updateStats();
document.getElementById("name").value="";
document.getElementById("studentId").value="";
document.getElementById("marks").value="";
}
function displayStudents(){
let table = document.getElementById("studentTable");
table.innerHTML="";
students.forEach((student,index)=>{
let grade = getGrade(student.marks);
let row = `
<tr>
<td>${student.name}</td>
<td>${student.id}</td>
<td>${student.marks}</td>
<td><span class="grade ${grade}">${grade}</span></td>
<td>
<button class="edit-btn" onclick="editStudent(${index})">Edit</button>
<button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
</td>
</tr>
`;
table.innerHTML += row;
});
}
function deleteStudent(index){
students.splice(index,1);
saveStudents();
displayStudents();
updateChart();
updateStats();
}
function editStudent(index){
let student = students[index];
document.getElementById("name").value = student.name;
document.getElementById("studentId").value = student.id;
document.getElementById("marks").value = student.marks;
students.splice(index,1);
saveStudents();
displayStudents();
updateChart();
updateStats();
}
function updateStats(){
document.getElementById("totalStudents").textContent = students.length;
if(students.length === 0){
document.getElementById("avgMarks").textContent = 0;
document.getElementById("topGrade").textContent = "-";
return;
}
let total = students.reduce((sum,s)=>sum + Number(s.marks),0);
let avg = Math.round(total / students.length);
document.getElementById("avgMarks").textContent = avg;
let grades = students.map(s => getGrade(s.marks));
let top = grades.sort()[0];
document.getElementById("topGrade").textContent = top;
}
function updateChart(){
let gradeCount = {A:0,B:0,C:0,D:0,F:0};
students.forEach(student=>{
let grade = getGrade(student.marks);
gradeCount[grade]++;
});
let ctx = document.getElementById("chart");
if(chart){
chart.destroy();
}
chart = new Chart(ctx,{
type:"bar",
data:{
labels:["A","B","C","D","F"],
datasets:[{
label:"Grade Distribution",
data:[
gradeCount.A,
gradeCount.B,
gradeCount.C,
gradeCount.D,
gradeCount.F
],
backgroundColor:[
"#22c55e",
"#3b82f6",
"#eab308",
"#f97316",
"#ef4444"
]
}]
}
});
}
function searchStudent(){
let search = document.getElementById("search").value.toLowerCase();
let rows = document.querySelectorAll("#studentTable tr");
rows.forEach(row => {
let name = row.children[0].textContent.toLowerCase();
row.style.display = name.includes(search) ? "" : "none";
});
}
displayStudents();
updateChart();
updateStats();