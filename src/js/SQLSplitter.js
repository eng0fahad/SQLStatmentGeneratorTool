document.getElementById("generateSQL").addEventListener("click", () => {
  const fileInput = document.getElementById("excelInput");
  const queryInput = document.getElementById("queryInput").value.trim();
  const limit = parseInt(
    document.getElementById("limitInput").value.trim(),
    10
  );
  const outputButtons = document.getElementById("outputButtons");

  if (!fileInput.files[0]) {
    alert("Please upload an Excel file.");
    return;
  }
  if (!queryInput) {
    alert("Please enter an SQL query.");
    return;
  }
  if (!limit || limit <= 0) {
    alert("Please enter a valid limit.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      alert("The uploaded Excel file is empty or invalid.");
      return;
    }

    // Clear previous SQL queries
    outputButtons.innerHTML = "";

    // Generate SQL queries
    let currentBatch = [];
    let queries = [];

    jsonData.forEach((row, index) => {
      currentBatch.push(row);
      if (currentBatch.length === limit || index === jsonData.length - 1) {
        let sql = queryInput;
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const colPlaceholder = `#Col${colIndex + 1}`;
          const colValues = currentBatch.map((r) => r[colIndex]).join(",");
          sql = sql.replace(colPlaceholder, colValues);
        }
        sql = sql.replace(/,\)/g, ")"); // Remove trailing commas before closing parenthesis
        queries.push(sql);
        currentBatch = [];
      }
    });

    // Create buttons to copy queries
    queries.forEach((query, i) => {
      const button = document.createElement("button");
      button.textContent = `Part ${i + 1}`;
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(query).then(() => {
          button.classList.add("copied");
        });
      });
      outputButtons.appendChild(button);
    });

    // Enable download button
    document.getElementById("downloadSQL").style.display = "block";
    document.getElementById("downloadSQL").onclick = () => {
      const zip = new JSZip();
      queries.forEach((query, index) => {
        zip.file(`sql_statement_part_${index + 1}.txt`, query);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sql_statements.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
});
document.getElementById("generateSQL").addEventListener("click", () => {
  const fileInput = document.getElementById("excelInput");
  const queryInput = document.getElementById("queryInput").value.trim();
  const limit = parseInt(
    document.getElementById("limitInput").value.trim(),
    10
  );
  const outputButtons = document.getElementById("outputButtons");

  if (!fileInput.files[0]) {
    alert("Please upload an Excel file.");
    return;
  }
  if (!queryInput) {
    alert("Please enter an SQL query.");
    return;
  }
  if (!limit || limit <= 0) {
    alert("Please enter a valid limit.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      alert("The uploaded Excel file is empty or invalid.");
      return;
    }

    // Clear previous SQL queries
    outputButtons.innerHTML = "";

    // Generate SQL queries
    let currentBatch = [];
    let queries = [];

    jsonData.forEach((row, index) => {
      currentBatch.push(row);
      if (currentBatch.length === limit || index === jsonData.length - 1) {
        let sql = queryInput;
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const colPlaceholder = `#Col${colIndex + 1}`;
          const colValues = currentBatch.map((r) => r[colIndex]).join(",");
          sql = sql.replace(colPlaceholder, colValues);
        }
        sql = sql.replace(/,\)/g, ")"); // Remove trailing commas before closing parenthesis
        queries.push(sql);
        currentBatch = [];
      }
    });

    // Create buttons to copy queries
    queries.forEach((query, i) => {
      const button = document.createElement("button");
      button.textContent = `Part ${i + 1}`;
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(query).then(() => {
          button.classList.add("copied");
        });
      });
      outputButtons.appendChild(button);
    });

    // Enable download button
    document.getElementById("downloadSQL").style.display = "block";
    document.getElementById("downloadSQL").onclick = () => {
      const zip = new JSZip();
      queries.forEach((query, index) => {
        zip.file(`sql_statement_part_${index + 1}.txt`, query);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sql_statements.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
});
