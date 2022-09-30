//defining global variables in order to update the details
//isUpdate to check for true or false whether update was done or not
let isUpdate=false;
//creating employeepayrollobj (Json) whiich will be used to update the employee details in local storage
let employeePayrollObj={};

//when content of webpage is loaded, this event gets fired
window.addEventListener('DOMContentLoaded',(event)=>{
    //checking for update as soon as the content page of html gets loaded, if check for update is passed
    //then populating emp payroll form
    checkForUpdate();

    //getting the name and text error and trying to print error message if regex condition is not satisfied
    const name= document.querySelector('#name');
    const textError= document.querySelector('.name-error');
    //adding event listener for name input and defining function for the same
    name.addEventListener('input',function(){
        //if name length is 0, then no error message is printed
        if(name.value.length==0)
        {
            textError.textContent="";
            return;
        }
        try{
            //passing name values in employee payroll data class object and name property and checing if exception is thrown
            (new EmployeePayrollData()).name=name.value;
            textError.textContent="";
        }
        catch(e)
        {
            //passing exception message to texterror const.
            textError.textContent=e;
        }
        
    });
   

    //adding event listener for salary and changing salary output for every salary input made through scrolling
    const salary= document.querySelector('#salary');
    const output= document.querySelector('.salary-output');
    //showing the output equal to salary initially.
    output.textContent=salary.value;
    //adding event listenr for salary and printing the salary for each input dynamically.
    salary.addEventListener('input',function(){
    output.textContent=salary.value;
    });
    //method to validate date if, entered in correct range and do not represent future range
    dateError= document.querySelector(".date-error");
    var year= document.querySelector('#year');
    var month= document.querySelector('#month');
    var day=document.querySelector('#day');
    //as year, month or day any input may be changed from user, hence all 3 event listneres are defined
    year.addEventListener('input',checkDate);
    month.addEventListener('input',checkDate);
    day.addEventListener('input',checkDate)
    //calling checkDate method from event listeners
    function checkDate(){ 
    try
    {   
        //converting value of dates from day id, month id and year id into date string
        //getinputvaluebyid is a method which is used to return value using document.queryselector for particular id and returns the output.
        let dates= getInputValueById("#day")+" "+getInputValueById("#month")+" "+getInputValueById("#year");
        //dates is parsed to date and passed to object of employee payroll data class - start date
        dates=new Date(Date.parse(dates));
        (new EmployeePayrollData()).startDate=dates;
        //if condition is not satisfied, then error is thrown and catched by try-catch block
        dateError.textContent="";
    }
    catch(e)
    {
        dateError.textContent=e;
    }

}


});
//calling save function to save values entered through form into obect and object into local storage
//when submit button is pressed, save method is initiated
const save=(event)=>{
    //prevents removing of data, if there is error in name or date
    event.preventDefault();
    //if there is error, then form will not be submitted
    event.stopPropagation();
    try
    {
        setEmployeePayrollObject(); 
        createAndUpdateStorage();
        /*//calling a method create employee payroll which gets the data from form and adds it into employee payroll object which is assigned to 
        //employeepayroll data here
        let employeePayrollData= createEmployeePayroll();
        //passing employeepayrolldata object to create and update storage method to add it into local storage
        createAndUpdateStorage(employeePayrollData);*/
        //once the value is submitted, form is reset to empty.
        resetForm();
        //after resetting, moving back to home page.
        window.location.replace(site_properties.home_page);
    }
    catch(e)
    {
        return;
    }
    //refactoring the code to populate employee payroll oject defined globally and filling values in employee payroll object instead of
    //creating the object of employee payroll seperately in create employee payroll 
  
}
const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+
               getInputValueById('#year') ;
    employeePayrollObj._startDate = date;
}

function createAndUpdateStorage()
{
    let employeePayrollList= JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList)
    {
        let empPayrollData= employeePayrollList.find(empData=>empData._id==employeePayrollObj._id)
        if(!empPayrollData)
        {
            employeePayrollList.push(createEmployeePayrollData());

        }
        else
        {
            const index= employeePayrollList.map(empData=>empData._id).indexOf(empPayrollData._id);
            employeePayrollList.splice(index,1,createEmployeePayrollData(empPayrollData._id));
        }
    }
    else
    {
        employeePayrollList=[createEmployeePayrollData()]
    }
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));   
}
const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
      employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
      setTextValue('.name-error', e);
      throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = 
            new Date(Date.parse(employeePayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

//defining method for selecting values and adding into array
//property name consist of name of field defined in html tags
const getSelectedValues=(propertyValue)=>{
    //getting all the values defined in html using the name
    let allItems= document.querySelectorAll(propertyValue);
    //defining empty array
    let selItems=[];
    //all value of allItems are iterated and once checked values are found out, item value is pushed into selItems array.
    allItems.forEach(item=>{
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}
//getting input value by id using query selector
const getInputValueById=(id)=>
{
    let value= document.querySelector(id).value;
    return value;
}
//getting input element value using getelementbyid method
const getInputElementValue=(id)=>{
    let value= document.getElementById(id).value;
    return value;
}
//reset form
//when reset button is pressed, then resetForm() method is called
//all the values in form are reset to empty values
const resetForm=()=>{
    //calling set values for defining field into empty string
    setValue('#name','');
    //calling unset selected values to uncheck radio and checked boxes.
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day',1);
    setValue('#month','January');
    setValue('#year','2020');
}
//for all the selected value for name (propertyvalue) passed in html, all the elements for name is queried 
const unsetSelectedValues= (propertyValue)=>{
    let allItems= document.querySelectorAll(propertyValue);
    //iterating through loop and converting items.checked=false for unchecking
    allItems.forEach(items=>{
        items.checked=false;
    });
}
//settext value method sets value for particular class in between opening and closing tags 
//for ex error tags
const setTextValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.textContent=value;
}
//set value method is used to set value of field defined in form to be particular value.
//value from fields in html is  passed for processing from html.
//text values are directly values and radio and checked buttons have their values defined.
//select options also have their value defined after selecting from dropdowns.
const setValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.value=value;
}

//checking for update
const checkForUpdate=()=>{
    //getting values from local storage for editEmp key
    const employeePayrollJson= localStorage.getItem('editEmp');
    //if isupdate is true, then json parsing is done to get objects of employee payroll
    //in the form, objects were added in local storage before stringifying 
    isUpdate= employeePayrollJson?true:false;
    if(!isUpdate) return;
    employeePayrollObj= JSON.parse(employeePayrollJson);
    //calling set form method to populate form
    setForm();
}
//setting the values in the form function
const setForm = () => {
    //calling set value function to set text fields and date
    setValue('#name', employeePayrollObj._name);
    //calling set selected values function to check the fields
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    //calling set text value function to set text content of output salary
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}
//set selected values function to set checked values for gender, department and profile pic
const setSelectedValues = (propertyValue, value) => {
    //getting all the items for name passed in query selector
    let allItems = document.querySelectorAll(propertyValue);
    //for each item of all items, condition is checked if item is array or not
    allItems.forEach(item => {
        //if value that recieved as input is array, then value array is checked for item value received from all items
        //if value matches, particular item is checked
        if(Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        //if value is not array, then foreach item (properties) from allitems,item is compared to value and then checked if true. 
        else if (item.value === value)
            item.checked = true;
    });    
}