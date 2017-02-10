function createEl(t,e,i,s){var n=document.createElement(t);return 1!==e.nodeType&&(e=document.createTextNode(e)),n.appendChild(e),i&&(n.className=i),s&&(n.id=s),n}function setDB(){dbName="tuduDBv0.2",tuduDb=new DB;var t={tasks:[],lists:[]};tuduDb.connect(dbName,t)}function loadHome(){listsList.innerHTML="";var t=tuduDb.getTable("lists");t.forEach(function(t){var t=t,e=createEl("li",t.name,"listsList-item",t.id);e.addEventListener("click",function(){openList(t.id)}),listsList.appendChild(e)})}function writeListTitle(t){taskListTitle.innerHTML="";var e=tuduDb.getRow(currentListInput.value,"lists"),i=document.createTextNode(e.name);taskListTitle.appendChild(i)}function setTabs(){listTabsButtons.forEach(function(t){t.classList.remove("listSection-actionButton-active")});var t=document.querySelector('.listSection-actionButton[value="'+filter.value+'"]');t.classList.add("listSection-actionButton-active")}function writeListTasks(){taskList.innerHTML="";var t=currentListInput.value,e=getTasksFromList(t,filter.value);if(e.length>0)e.forEach(function(t){var e=createEl("label",t.text,"list-item-label"),i=createEl("input","","list-item-check");i.setAttribute("type","checkbox"),i.addEventListener("click",function(){completeTask(t.id)});var s=createEl("button","","list-item-destroy");s.addEventListener("click",function(){deleteTask(t.id)});var n=createEl("li","","list-item",t.id);t.completed&&(n.classList.add("completed"),i.setAttribute("checked",!0)),n.appendChild(i),n.appendChild(e),n.appendChild(s),taskList.appendChild(n)});else{var i="There is nothing here.",s=createEl("p",i,"list-message");taskList.appendChild(s)}}function openList(t){listView.classList.add("listView-show"),currentListInput.value=t,writeListTitle(),setTabs(),writeListTasks()}function getTasksFromList(t,e){var e=e||"all",i=0,s=tuduDb.getTable("tasks"),n=[];return s.forEach(function(s){if(s.list===t){if("active"===e&&s.completed)return;if("completed"===e&&!s.completed)return;n.push(s),i++}}),n}function saveTask(t,e){e?tuduDb.updateRow(t,"tasks"):(t.completed=!1,t.list=currentListInput.value,tuduDb.addRow(t,"tasks")),tuduDb.save(),writeListTasks()}function completeTask(t){var e,i=tuduDb.getRow(t,"tasks");e=i.completed?{completed:!1}:{completed:!0},tuduDb.updateRow(e,t,"tasks"),tuduDb.save(),writeListTasks()}function clearList(t){var e=getTasksFromList(t);e.forEach(function(t){tuduDb.removeRow(t.id,"tasks")}),tuduDb.save(),writeListTasks()}function deleteList(t){tuduDb.removeRow(t,"lists"),tuduDb.save(),loadHome()}function saveList(t,e){e?tuduDb.updateRow(t,"lists"):tuduDb.addRow(t,"lists"),tuduDb.save(),loadHome()}!function(){"use strict";function t(){function t(t){return JSON.stringify(t)}function e(t){return JSON.parse(t)}function i(){var t=(new Date).getTime();return t=t.toString()}this.dbName,this.data,this.connect=function(t,e){this.dbName=t,localStorage.getItem(this.dbName)?this.data=this.fetch():(this.data=e||{},this.save(e))},this.fetch=function(){return e(localStorage.getItem(this.dbName))},this.addTable=function(t){this.data[t]?console.error("Database error: table already exists."):this.data[t]=[]},this.addRow=function(t,e){this.data[e]?(t.id=i(),this.data[e].push(t)):console.error("Database error: table doesn't exists")},this.getTable=function(t){return this.data[t]?this.data[t]:void console.error("Database error: table doesn't exists.")},this.getRow=function(t,e){for(var i,e=this.data[e],s=e.length-1;s>=0;s--)if(e[s].id===t){i=e[s];break}return i?i:void console.error("Database error: Row doesn't exists.")},this.updateRow=function(t,e,i){var s,i=this.data[i];if(i){for(var n=i.length-1;n>=0;n--)if(i[n].id===e){s=i[n];for(var a in t)s[a]=t[a];break}s||console.error("Database error: invalid row.")}else console.error("Database error: invalid table.")},this.removeRow=function(t,e){var i,e=this.data[e];if(e){for(var s=e.length-1;s>=0;s--)if(e[s].id===t){i=e[s],e.splice(s,1);break}i||console.error("Database error: invalid row.")}else console.error("Database error: invalid table.")},this.dropTable=function(t){delete this.data[t]},this.clear=function(){this.data={}},this.drop=function(){localStorage.removeItem(this.dbName)},this.save=function(){var e=t(this.data);localStorage.setItem(this.dbName,e)}}window.DB=t}();var dbName,tuduDb,listsList=document.getElementById("lists-list"),saveListDialog=document.getElementById("save-list-dialog"),listView=document.getElementById("list-view"),listViewOptions=document.getElementById("list-view-options"),taskListTitle=document.getElementById("task-list-title"),taskList=document.getElementById("task-list"),currentListInput=document.getElementById("current-list-input"),filter=document.getElementById("current-list-filter"),tasksInput=document.getElementById("new-task-input");tasksInput.addEventListener("focus",function(){this.parentElement.classList.add("newTask-active")}),tasksInput.addEventListener("blur",function(){this.parentElement.classList.remove("newTask-active")}),tasksInput.onkeyup=function(t){if(13==t.keyCode){var e=this.value.trim();if(""!==e){var i={text:e};saveTask(i),this.value=""}}};var saveListInput=document.getElementById("save-list-input");saveListInput.onkeyup=function(){if(13==event.keyCode){var t=this.value.trim();if(""!==t){var e={name:newListName};saveList(e),this.value="",saveListDialog.classList.remove("dialog-visible")}}};var openSaveListDialogButton=document.getElementById("open-savelist-dialog-button");openSaveListDialogButton.addEventListener("click",function(t){t.stopPropagation(),saveListDialog.classList.add("dialog-visible")});var cancelSaveListButton=document.getElementById("cancel-save-list-button");cancelSaveListButton.addEventListener("click",function(t){saveListInput.value="",saveListDialog.classList.remove("dialog-visible")});var saveListButton=document.getElementById("save-list-button");saveListButton.addEventListener("click",function(){var t=saveListInput.value.trim();if(""!==t){var e={name:t};saveList(e),saveListInput.value="",saveListDialog.classList.remove("dialog-visible")}});var saveListDialogContent=document.getElementById("save-list-dialog-content");saveListDialogContent.addEventListener("click",function(t){t.stopPropagation()});var closeListViewButton=document.getElementById("close-list-view");closeListViewButton.addEventListener("click",function(){listView.classList.remove("listView-show")});var moreListOptionsButton=document.getElementById("more-list-options");moreListOptionsButton.addEventListener("click",function(t){t.stopPropagation(),listViewOptions.classList.toggle("listView-options-show")});var clearListButton=document.getElementById("clear-list");clearListButton.addEventListener("click",function(){clearList(currentListInput.value)});var deleteListButton=document.getElementById("delete-list");deleteListButton.addEventListener("click",function(){listView.classList.remove("listView-show"),deleteList(currentListInput.value)});var listTabsButtons=document.querySelectorAll(".listSection-actionButton");listTabsButtons.forEach(function(t){t.addEventListener("click",function(){var t=this.value;filter.value=t,setTabs(),writeListTasks()})});var mainNav=document.getElementById("main-nav"),mainNavContent=document.getElementById("main-nav-content");mainNavContent.addEventListener("click",function(t){t.stopPropagation()});var menuButton=document.getElementById("menu-button");menuButton.addEventListener("click",function(t){t.stopPropagation(),this.classList.toggle("menuButton-open"),mainNav.classList.toggle("mainNav-open")}),document.body.addEventListener("click",function(){mainNav.classList.remove("mainNav-open"),saveListDialog.classList.remove("dialog-visible"),listViewOptions.classList.remove("listView-options-show")}),document.body.onload=function(){setDB(),loadHome()},"serviceWorker"in navigator&&(navigator.serviceWorker.register("./sw.js").then(function(t){console.log("Succsessfully regitered service worker",t)}).catch(function(t){console.warn("Error whilst registering service worker",t)}),navigator.serviceWorker.ready.then(function(t){console.log("Service worker ready")}));