/**
 * Database implementation for Tudú app.
 * v0.1.2 (beta).
 * Developed by Erwin Larios.
 */
(function() {
  "use strict";

  /**
   * DB constructor.
   *
   * Calls DB class and waits for connection.
   */
  function DB() {
    /** Database name */
    this.dbName;
    /** Database data */
    this.data;

    /**
     * Load the database from localStorage or create it if
     * doesn't exists.
     *
     * @param {string} name - name of the database to connect.
     * @param {object} [data={}] - optional data to start the database.
     */
    this.connect = function(name, data) {
      this.dbName = name;

      if (!localStorage.getItem(this.dbName)) {
        this.data = data || {};
        this.save(data);
      } else {
        this.data = this.fetch();
      }
    }

    /**
     * Load all data from localStorage.
     *
     * @return {object} All actual data from database.
     */
    this.fetch = function() {
      return decode(localStorage.getItem(this.dbName));
    }

    /**
     * Create a new table
     *
     * @oaram {string} tableName - the name of the table to add.
     */
    this.addTable = function(tableName) {
      if (!this.data[tableName]) {
        this.data[tableName] = [];
      } else {
        console.error('Database error: table already exists.');
      }
    }

    /**
     * Add a new row on a given table.
     *
     * @param {object} rowData - data of the row to be added.
     * @param {string} table - name of the table to add the row.
     */
    this.addRow = function(rowData, table) {
      if (this.data[table]) {

        // Asign an ID if hasn't already.
        if (!rowData.id) {
          rowData.id = objectId();
        }

        this.data[table].push(rowData);
      } else {
        console.error('Database error: table doesn\'t exists');
      }
    }

    /**
     * Get all data from a table.
     *
     * @param {string} table - name of the table.
     * @returns {array} An array the table's data as objects.
     */
    this.getTable = function(table) {
      if (this.data[table]) {
        return this.data[table];
      } else {
        console.error('Database error: table doesn\'t exists.');
        return;
      }
    }

    /**
     * Get a specific row by its id from a table.
     *
     * @param {string} rowId - id of the row.
     * @param {string} table - name of the table.
     */
    this.getRow = function(rowId, table) {
      var table = this.data[table];
      var row;

      for (var i = table.length - 1; i >= 0; i--) {
        if (table[i].id === rowId) {
          row =  table[i];
          break;
        }
      }

      if (row) {
        return row;
      } else {
        console.error('Database error: Row doesn\'t exists.');
        return;
      }
    }

    /**
     * Update a row by its id.
     *
     * @param {object} newdata - new data to add or update.
     * @param {string} rowId - id of the row to be updated.
     * @param {string} table - name of the table to be updated.
     */
    this.updateRow = function(newData, rowId, table) {
      var table = this.data[table];
      var row;

      if (table) {
        for (var i = table.length - 1; i >= 0; i--) {
          if (table[i].id === rowId) {
            row = table[i];

            for (var key in newData) {
              row[key] = newData[key];
            }
            break;
          }
        }

        if (!row) {
          console.error('Database error: invalid row.');
        }
      } else {
        console.error('Database error: invalid table.');
      }
    }

    /**
     * Detele a row from a table.
     *
     * @param {string} rowId - id of the row to delete.
     * @param {string} table - name of the table.
     */
    this.removeRow = function(rowId, table) {
      var table = this.data[table];
      var row;

      if (table) {
        for (var i = table.length - 1; i >= 0; i--) {
          if (table[i].id === rowId) {
            row = table[i];
            table.splice(i, 1);
            break;
          }
        }

        if (!row) {
          console.error('Database error: invalid row.');
        }
      } else {
        console.error('Database error: invalid table.');
      }
    }

    /**
     * Delete a table.
     *
     * @param {string} table - name of the table to be deleted.
     */
    this.dropTable = function(table) {
      delete this.data[table];
    }

    /** Delete all database data */
    this.clear = function() {
      this.data = {};
    }

    /** Delete the database */
    this.drop = function() {
      localStorage.removeItem(this.dbName);
    }

    /**
     * Save the data to localStorage as a JSON object.
     */
    this.save = function() {
      // JSON-encode the data first.
      var encodedData = encode(this.data);
      // Write to localStorage
      localStorage.setItem(this.dbName, encodedData);
    }

    /** JSON-encode data */
    function encode(data) {
      return JSON.stringify(data);
    }

    /** JSON-decode data */
    function decode(data) {
      return JSON.parse(data);
    }

    /** Create id for objects/rows */
    function objectId() {
      var id = new Date().getTime();
      /**
       * Convert to string for better compatibility with html elements
       * atributes.
       */
      id = id.toString();

      return id;
    }
  }

  // Export class to window.
  window.DB = DB;
})();
