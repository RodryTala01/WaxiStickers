const IMAGE_FOLDER_ID = "";

const SHEET_HEADERS = {
  PRODUCTOS: [
    "id",
    "nombre",
    "categoria",
    "subcategoria",
    "imagen1",
    "imagen2",
    "activo",
    "orden",
    "destacado",
    "tipoPrecio",
    "precioFijo",
    "descripcion"
  ],
  PRECIOS: [
    "grupo",
    "item",
    "clave",
    "etiqueta",
    "detalle",
    "valor",
    "orden"
  ],
  PEDIDOS: [
    "pedidoId",
    "fecha",
    "cliente",
    "whatsapp",
    "email",
    "productoId",
    "producto",
    "categoria",
    "subcategoria",
    "tamano",
    "laminado",
    "cantidad",
    "precioUnitario",
    "subtotal",
    "totalPedido",
    "estado"
  ],
  CONFIG: [
    "clave",
    "valor"
  ]
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Catálogo")
    .addItem("Preparar hojas", "setupSheets")
    .addItem("Sincronizar imágenes desde Drive", "syncImagesFromDriveFolder")
    .addToUi();
}

function setupSheets() {
  Object.keys(SHEET_HEADERS).forEach(function (sheetName) {
    const sheet = getOrCreateSheet_(sheetName);
    const headers = SHEET_HEADERS[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  });

  seedConfig_();
}

function doGet(event) {
  const action = ((event && event.parameter && event.parameter.action) || "catalog").toLowerCase();

  if (action !== "catalog") {
    return json_({ ok: false, message: "Acción no disponible." });
  }

  return json_({
    ok: true,
    data: {
      PRODUCTOS: readSheet_("PRODUCTOS"),
      PRECIOS: readSheet_("PRECIOS"),
      CONFIG: readSheet_("CONFIG")
    }
  });
}

function doPost(event) {
  try {
    const request = JSON.parse((event && event.postData && event.postData.contents) || "{}");

    if (request.action === "saveOrder") {
      return json_(saveOrder_(request.payload));
    }

    return json_({ ok: false, message: "Acción no reconocida." });
  } catch (error) {
    return json_({ ok: false, message: error.message });
  }
}

function saveOrder_(payload) {
  const sheet = getOrCreateSheet_("PEDIDOS");
  ensureHeaders_(sheet, SHEET_HEADERS.PEDIDOS);
  const rows = (payload.rows || []).map(function (row) {
    return SHEET_HEADERS.PEDIDOS.map(function (header) {
      if (header === "estado") {
        return "Nuevo";
      }
      return row[header] || "";
    });
  });

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, SHEET_HEADERS.PEDIDOS.length).setValues(rows);
  }

  return { ok: true, rows: rows.length };
}

function syncImagesFromDriveFolder() {
  if (!IMAGE_FOLDER_ID) {
    throw new Error("Completá IMAGE_FOLDER_ID con el ID de la carpeta de Drive.");
  }

  const productSheet = getOrCreateSheet_("PRODUCTOS");
  ensureHeaders_(productSheet, SHEET_HEADERS.PRODUCTOS);
  const headers = productSheet.getRange(1, 1, 1, SHEET_HEADERS.PRODUCTOS.length).getValues()[0];
  const idColumn = headers.indexOf("id") + 1;
  const nameColumn = headers.indexOf("nombre") + 1;
  const image1Column = headers.indexOf("imagen1") + 1;
  const image2Column = headers.indexOf("imagen2") + 1;
  const lastRow = productSheet.getLastRow();

  if (lastRow < 2) {
    return { ok: true, updated: 0 };
  }

  const imageMap = getImageMapFromFolder_(IMAGE_FOLDER_ID);
  const values = productSheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.PRODUCTOS.length).getValues();
  let updated = 0;

  values.forEach(function (row, index) {
    const productId = String(row[idColumn - 1] || "").trim();
    const productName = String(row[nameColumn - 1] || "").trim();
    const productKeys = buildProductImageKeys_([productId, productName]);

    if (!productKeys.length) {
      return;
    }

    const image1 = findProductImage_(imageMap, productKeys, 1);
    const image2 = findProductImage_(imageMap, productKeys, 2);
    const rowNumber = index + 2;

    if (image1) {
      productSheet.getRange(rowNumber, image1Column).setValue(image1);
      updated += 1;
    }

    if (image2) {
      productSheet.getRange(rowNumber, image2Column).setValue(image2);
      updated += 1;
    }
  });

  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Imágenes sincronizadas: " + updated,
    "Catálogo",
    5
  );

  return { ok: true, updated: updated };
}

function getImageMapFromFolder_(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  const imageMap = {};

  while (files.hasNext()) {
    const file = files.next();
    const baseName = file.getName().replace(/\.[^.]+$/, "");
    const imageKey = normalizeImageKey_(baseName);

    if (!imageKey) {
      continue;
    }

    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    imageMap[imageKey] = buildDriveImageUrl_(file.getId());
  }

  return imageMap;
}

function buildDriveImageUrl_(fileId) {
  return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
}

function buildProductImageKeys_(values) {
  const seen = {};
  return values.map(function (value) {
    return normalizeImageKey_(value);
  }).filter(function (key) {
    if (!key || seen[key]) {
      return false;
    }

    seen[key] = true;
    return true;
  });
}

function findProductImage_(imageMap, productKeys, imageNumber) {
  const numberedSuffix = "-" + imageNumber;

  for (let index = 0; index < productKeys.length; index += 1) {
    const key = productKeys[index];

    if (imageMap[key + numberedSuffix]) {
      return imageMap[key + numberedSuffix];
    }

    if (imageNumber === 1 && imageMap[key]) {
      return imageMap[key];
    }
  }

  return "";
}

function normalizeImageKey_(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readSheet_(sheetName) {
  const sheet = getOrCreateSheet_(sheetName);
  ensureHeaders_(sheet, SHEET_HEADERS[sheetName]);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return [];
  }

  const headers = values[0];
  return values.slice(1).filter(function (row) {
    return row.some(function (cell) {
      return cell !== "";
    });
  }).map(function (row) {
    return headers.reduce(function (record, header, index) {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const missingHeader = headers.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (missingHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function getOrCreateSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function seedConfig_() {
  const sheet = getOrCreateSheet_("CONFIG");
  const values = sheet.getDataRange().getValues();

  if (values.length > 1) {
    return;
  }

  sheet.getRange(2, 1, 4, 2).setValues([
    ["whatsappNumber", "+54 1154865284"],
    ["whatsappLabel", "+54 11 5486-5284"],
    ["instagramUser", "@stickerstudio"],
    ["instagramUrl", "https://www.instagram.com/stickerstudio/"]
  ]);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
