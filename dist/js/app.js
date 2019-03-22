function Toast(t){function e(t){var e=createEl("div","",n),i=createEl("span",t,"toast-text");return e.appendChild(i),e}function i(e,i){setTimeout(function(){t.contains(e)&&t.removeChild(e)},i)}var t=t,n="toast";this.simple=function(n){var s=e(n);t.appendChild(s),i(s,3e3)},this.action=function(n,s,a){var o=e(n),r=createEl("button",s,"toast-action");r.addEventListener("click",function(){a(),t.removeChild(o)}),o.appendChild(r),t.appendChild(o),i(o,3e3)}}function createEl(t,e,i,n){var s=document.createElement(t);return 1!==e.nodeType&&(e=document.createTextNode(e)),s.appendChild(e),i&&(s.className=i),n&&(s.id=n),s}function getRandomInt(t,e){return Math.floor(Math.random()*(e-t+1))+t}function getRandomColor(){var t=["#FFCDD2","#F8BBD0","#E1BEE7","#D1C4E9","#C5CAE9","#BBDEFB","#B3E5FC","#B2EBF2","#B2DFDB","#C8E6C9","#DCEDC8","#F0F4C3","#FFF9C4","#FFECB3","#FFE0B2","#FFCCBC","#D7CCC8"];return t[getRandomInt(0,t.length-1)]}function truncate(t,e){return t.length>e?t.substring(0,e)+"…":t}function setDB(){dbName="tuduDBv0.2",tuduDb=new DB;var t={tasks:[],lists:[]};tuduDb.connect(dbName,t)}function loadHome(){document.body.classList.remove("listOpen");for(var t=document.getElementsByClassName("myLists-list"),e=t.length-1;e>=0;e--)listsList.removeChild(t[e]);document.getElementById("loader").classList.add("loader-hidden");var i=document.getElementById("open-savelist-dialog-button"),n=tuduDb.getTable("lists");n&&n.forEach(function(t){var t=t,e=createEl("li",t.name,"myLists-list",t.id);e.style.backgroundColor=t.color,e.addEventListener("click",function(){openList(t.id)}),listsList.insertBefore(e,i)})}function writeListTitle(){taskListTitle.innerHTML="";var t=tuduDb.getRow(currentListInput.value,"lists");listViewHeader.style.backgroundColor=t.color;var e=document.createTextNode(t.name);taskListTitle.appendChild(e)}function setTabs(){listTabsButtons.forEach(function(t){t.classList.remove("taskTabs-button-active")}),document.querySelector('.taskTabs-button[value="'+filter.value+'"]').classList.add("taskTabs-button-active")}function writeListTasks(){taskList.innerHTML="";var t=currentListInput.value,e=getTasksFromList(t,filter.value);if(e.length>0)e.forEach(function(t){var e=createEl("label",t.text,"task-label"),i=createEl("input","","task-check");i.setAttribute("type","checkbox"),i.addEventListener("click",function(){completeTask(t.id)});var n=createEl("button","","task-destroy");n.addEventListener("click",function(){deleteTask(t.id)});var s=createEl("li","","task",t.id);t.completed&&(s.classList.add("completed"),i.setAttribute("checked",!0)),s.appendChild(i),s.appendChild(e),s.appendChild(n),taskList.appendChild(s)});else{var i=createEl("p","There is nothing here.","tasksList-message");taskList.appendChild(i)}}function openList(t){listView.classList.add("listView-open"),document.body.classList.add("listOpen"),currentListInput.value=t,writeListTitle(),setTabs(),writeListTasks()}function getTasksFromList(t,e){var e=e||"all",i=tuduDb.getTable("tasks"),n=[];return i.forEach(function(i){if(i.list===t){if("active"===e&&i.completed)return;if("completed"===e&&!i.completed)return;n.push(i)}}),n}function saveTask(t,e){e?tuduDb.updateRow(t,"tasks"):(t.completed=!1,t.list=currentListInput.value,tuduDb.addRow(t,"tasks")),tuduDb.save(),writeListTasks();var i=truncate(t.text,12);toast.simple('New task "'+i+'" created.')}function completeTask(t){var e,i=tuduDb.getRow(t,"tasks");e=i.completed?{completed:!1}:{completed:!0},tuduDb.updateRow(e,t,"tasks"),tuduDb.save(),writeListTasks()}function deleteTask(t){function e(){tuduDb.addRow(i,"tasks"),tuduDb.save(),writeListTasks()}var i=tuduDb.getRow(t,"tasks");tuduDb.removeRow(t,"tasks"),tuduDb.save(),writeListTasks();var n=truncate(i.text,12);toast.action('Task "'+n+'" deleted.',"Undo",e)}function clearList(t){function e(){i.forEach(function(t){tuduDb.addRow(t,"tasks")}),tuduDb.save(),writeListTasks()}var i=getTasksFromList(t);i.forEach(function(t){tuduDb.removeRow(t.id,"tasks")}),tuduDb.save(),writeListTasks(),toast.action("List cleared.","Undo",e)}function deleteList(t){function e(){tuduDb.addRow(i,"lists"),tuduDb.save(),loadHome()}var i=tuduDb.getRow(t,"lists");tuduDb.removeRow(t,"lists"),tuduDb.save(),loadHome();var n=truncate(i.name,12);toast.action('List "'+n+'" deleted.',"Undo",e)}function deleteAll(){function t(){tuduDb.data=e,tuduDb.save(),loadHome()}var e=tuduDb.fetch();tuduDb.clear(),tuduDb.data={tasks:[],lists:[]},tuduDb.save(),loadHome(),toast.action("All lists deleted","Undo",t)}function saveList(t,e){e?tuduDb.updateRow(t,"lists"):tuduDb.addRow(t,"lists"),tuduDb.save(),loadHome();var i=truncate(t.name,12);toast.simple('List "'+i+'" created')}function editListTitle(t,e){var i={name:t};tuduDb.updateRow(i,e,"lists"),tuduDb.save(),writeListTitle(),loadHome(),toast.simple("List title edited")}!function(){"use strict";function t(){function t(t){return JSON.stringify(t)}function e(t){return JSON.parse(t)}function i(){var t=(new Date).getTime();return t=t.toString()}this.dbName,this.data,this.connect=function(t,e){this.dbName=t,localStorage.getItem(this.dbName)?this.data=this.fetch():(this.data=e||{},this.save(e))},this.fetch=function(){return e(localStorage.getItem(this.dbName))},this.addTable=function(t){this.data[t]?console.error("Database error: table already exists."):this.data[t]=[]},this.addRow=function(t,e){this.data[e]?(t.id||(t.id=i()),this.data[e].push(t)):console.error("Database error: table doesn't exists")},this.getTable=function(t){return this.data[t]?this.data[t]:void console.error("Database error: table doesn't exists.")},this.getRow=function(t,e){for(var i,e=this.data[e],n=e.length-1;n>=0;n--)if(e[n].id===t){i=e[n];break}return i||void console.error("Database error: Row doesn't exists.")},this.updateRow=function(t,e,i){var n,i=this.data[i];if(i){for(var s=i.length-1;s>=0;s--)if(i[s].id===e){n=i[s];for(var a in t)n[a]=t[a];break}n||console.error("Database error: invalid row.")}else console.error("Database error: invalid table.")},this.removeRow=function(t,e){var i,e=this.data[e];if(e){for(var n=e.length-1;n>=0;n--)if(e[n].id===t){i=e[n],e.splice(n,1);break}i||console.error("Database error: invalid row.")}else console.error("Database error: invalid table.")},this.dropTable=function(t){delete this.data[t]},this.clear=function(){this.data={}},this.drop=function(){localStorage.removeItem(this.dbName)},this.save=function(){var e=t(this.data);localStorage.setItem(this.dbName,e)}}window.DB=t}();var Router={routes:[],mode:null,root:"/",config:function(t){return this.mode=t&&t.mode&&"history"==t.mode&&history.pushState?"history":"hash",this.root=t&&t.root?"/"+this.clearSlashes(t.root)+"/":"/",this},getFragment:function(){var t="";if("history"===this.mode)t=this.clearSlashes(decodeURI(location.pathname+location.search)),t=t.replace(/\?(.*)$/,""),t="/"!=this.root?t.replace(this.root,""):t;else{var e=window.location.href.match(/#(.*)$/);t=e?e[1]:""}return this.clearSlashes(t)},clearSlashes:function(t){return t.toString().replace(/\/$/,"").replace(/^\//,"")},add:function(t,e){return"function"==typeof t&&(e=t,t=""),this.routes.push({re:t,handler:e}),this},remove:function(t){for(var e,i=0;this.routes.length,e=this.routes[i];i++)if(e.handler===t||e.re.toString()===t.toString())return this.routes.splice(i,1),this;return this},flush:function(){return this.routes=[],this.mode=null,this.root="/",this},check:function(t){for(var e=t||this.getFragment(),i=0;i<this.routes.length;i++){var n=e.match(this.routes[i].re);if(n)return n.shift(),this.routes[i].handler.apply({},n),this}return this},listen:function(){var t=this,e=t.getFragment(),i=function(){e!==t.getFragment()&&(e=t.getFragment(),t.check(e))};return clearInterval(this.interval),this.interval=setInterval(i,50),this},navigate:function(t){return t=t||"","history"===this.mode?history.pushState(null,null,this.root+this.clearSlashes(t)):window.location.href=window.location.href.replace(/#(.*)$/,"")+"#"+t,this}},dbName,tuduDb,toastContainer=document.getElementById("toast-container"),toast=new Toast(toastContainer),listsList=document.getElementById("lists-list"),saveListDialog=document.getElementById("save-list-dialog"),listView=document.getElementById("list-view"),listViewHeader=document.getElementById("list-view-header"),listViewOptions=document.getElementById("list-view-options"),taskListTitle=document.getElementById("task-list-title"),taskList=document.getElementById("task-list"),currentListInput=document.getElementById("current-list-input"),filter=document.getElementById("current-list-filter"),saveListInput=document.getElementById("save-list-input");saveListInput.addEventListener("focus",function(){this.parentElement.classList.add("newList-formGroup-active")}),saveListInput.addEventListener("blur",function(){this.parentElement.classList.remove("newList-formGroup-active")}),saveListInput.onkeyup=function(){13==event.keyCode&&saveListButton.click()};var saveListButton=document.getElementById("save-list-button");saveListButton.addEventListener("click",function(){var t=saveListInput.value.trim();if(""!==t&&t.length<=60){saveList({name:t,color:getRandomColor()}),saveListInput.value="",saveListDialog.classList.remove("dialog-visible")}});var closeListViewButton=document.getElementById("close-list-view");closeListViewButton.addEventListener("click",function(){listView.classList.remove("listView-open"),document.body.classList.remove("listOpen")});var clearListButton=document.getElementById("clear-list");clearListButton.addEventListener("click",function(){clearList(currentListInput.value)});var deleteListButton=document.getElementById("delete-list");deleteListButton.addEventListener("click",function(){listView.classList.remove("listView-open"),deleteList(currentListInput.value)});var editListTitleButton=document.getElementById("edit-list-title-button");editListTitleButton.addEventListener("click",function(){listViewHeader.classList.add("listView-header-edit");var t=taskListTitle.innerText,e=createEl("input","","listView-header-titleEdit");e.value=t,e.type="text",e.maxlength="60",e.addEventListener("blur",function(){listViewHeader.classList.remove("listView-header-edit"),listViewHeader.removeChild(e)}),e.onkeyup=function(t){if(13===t.keyCode){var i=e.value.trim();""!==i&&i.length<=190&&editListTitle(i,currentListInput.value),e.blur()}};var i=document.getElementById("more-list-options");listViewHeader.insertBefore(e,i),e.focus()});var tasksInput=document.getElementById("new-task-input");tasksInput.addEventListener("focus",function(){this.parentElement.parentElement.classList.add("newTask-active")}),tasksInput.addEventListener("blur",function(){this.parentElement.parentElement.classList.remove("newTask-active")}),tasksInput.onkeyup=function(t){13==t.keyCode&&newTaskButton.click()};var newTaskButton=document.getElementById("new-task-button");newTaskButton.addEventListener("click",function(t){var e=tasksInput.value.trim();if(""!==e&&e.length<=200){saveTask({text:e}),tasksInput.value="",tasksInput.blur()}});var listTabsButtons=document.querySelectorAll(".taskTabs-button");listTabsButtons.forEach(function(t){t.addEventListener("click",function(){var t=this.value;filter.value=t,setTabs(),writeListTasks()})});var dialogs=document.querySelectorAll("[data-dialog]");dialogs.forEach(function(t){t.querySelector("[data-dialog-content]").addEventListener("click",function(t){t.stopPropagation()})});var openDialogButtons=document.querySelectorAll("[data-dialog-open]");openDialogButtons.forEach(function(t){t.addEventListener("click",function(t){t.stopPropagation(),t.preventDefault(),mainNav.classList.remove("mainNav-open");var e=this.getAttribute(["data-dialog-open"]);document.querySelector("[data-dialog="+e+"]").classList.add("dialog-visible")})});for(var closeDialogButton=document.querySelectorAll("[data-dialog-close]"),i=closeDialogButton.length-1;i>=0;i--)closeDialogButton[i].addEventListener("click",function(){var t=this.getAttribute(["data-dialog-close"]);document.querySelector("[data-dialog="+t+"]").classList.remove("dialog-visible")});var mainNav=document.getElementById("main-nav"),mainNavContent=document.getElementById("main-nav-content");mainNavContent.addEventListener("click",function(t){t.stopPropagation()});var menuButton=document.getElementById("menu-button");menuButton.addEventListener("click",function(t){t.stopPropagation(),this.classList.toggle("menuButton-open"),mainNav.classList.toggle("mainNav-open")});var deleteAllListsButton=document.getElementById("delete-all-lists-button");deleteAllListsButton.addEventListener("click",function(t){t.preventDefault(),document.querySelector('[data-dialog="confirm"]').classList.remove("dialog-visible"),deleteAll()});var dropdowns=document.querySelectorAll("[data-dropdown]"),dropdownOpenButtons=document.querySelectorAll("[data-dropdown-open]");dropdownOpenButtons.forEach(function(t){t.addEventListener("click",function(e){e.stopPropagation();var i=t.getAttribute(["data-dropdown-open"]);document.querySelector("[data-dropdown="+i+"]").classList.add("dropdown-visible")})}),document.body.addEventListener("click",function(){mainNav.classList.remove("mainNav-open"),dropdowns.forEach(function(t){t.classList.remove("dropdown-visible")}),dialogs.forEach(function(t){t.classList.remove("dialog-visible")}),listViewOptions.classList.remove("listView-options-show")}),Router.config({mode:"history"}),Router.add(/list\/(.*)/,function(){console.log("list",arguments)}).check(),document.body.onload=function(){setDB(),loadHome()},"serviceWorker"in navigator&&(navigator.serviceWorker.register("./sw.js").then(function(t){console.log("Succsessfully regitered service worker",t)}).catch(function(t){console.warn("Error whilst registering service worker",t)}),navigator.serviceWorker.ready.then(function(t){console.log("Service worker ready"),toast.simple("App ready to work offline.")}));