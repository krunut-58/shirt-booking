
/**
 * GOOGLE APPS SCRIPT FOR SHIRT BOOKING (IMPROVED)
 * 
 * 1. Sheet ID: 1qpPOUvCXc5aY831mbvbl4j18jI128hFyEx-7ZQw10Ak
 * 2. Sheet Name: ระบบจะพยายามหาชื่อ "ชีต1" ถ้าไม่เจอจะใช้ชีตแรก
 * 3. Folder ID: 1agLgxwlMVdgRH1qJFNY3eIX32Zp_DX8A
 */

const SHEET_ID = "1qpPOUvCXc5aY831mbvbl4j18jI128hFyEx-7ZQw10Ak";
const SHEET_NAME = "ชีต1";
const FOLDER_ID = "1agLgxwlMVdgRH1qJFNY3eIX32Zp_DX8A";

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // หากไม่พบชื่อชีตที่ระบุ ให้ใช้ชีตแรกสุด
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    // ตรวจสอบและสร้างหัวตารางถ้าชีตว่างเปล่า
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ประทับเวลา", "ชื่อ-นามสกุล", "โรงเรียน", "เบอร์โทร", 
        "SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", 
        "รวม", "การส่ง", "ที่อยู่", "หลักฐานการโอน", "สถานะการโอน", "สถานะการส่ง"
      ]);
    }

    // จัดการไฟล์สลิป
    let slipUrl = "ไม่ได้แนบไฟล์";
    if (contents.slip) {
      try {
        const folder = DriveApp.getFolderById(FOLDER_ID);
        const blob = Utilities.newBlob(Utilities.base64Decode(contents.slip), contents.mimeType, contents.fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        slipUrl = file.getUrl();
      } catch (fErr) {
        slipUrl = "เกิดข้อผิดพลาดในการบันทึกไฟล์: " + fErr.toString();
      }
    }
    
    const q = contents.quantities;
    const total = Object.values(q).reduce((a, b) => a + (Number(b) || 0), 0);
    
    // บันทึกแถวใหม่
    sheet.appendRow([
      Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss"),
      contents.fullName,
      contents.school,
      contents.phone,
      q.ss || 0, q.s || 0, q.m || 0, q.l || 0, q.xl || 0, q['2xl'] || 0, q['3xl'] || 0, q['4xl'] || 0, q['5xl'] || 0,
      total,
      contents.shipping === 'delivery' ? 'จัดส่ง (+50)' : 'รับเอง',
      contents.address || "-",
      slipUrl,
      "รอตรวจสอบข้อมูล",
      "รอจัดส่ง"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  if (action === "getList") {
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.getSheets()[0];
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return returnData({ data: [] }, callback);
      }
      
      const rows = data.slice(1); // ข้ามหัวตาราง
      
      const result = rows.map(row => ({
        timestamp: String(row[0]), // บังคับเป็น String ป้องกัน JSONP error กับ Date object
        fullName: String(row[1] || ""),
        school: String(row[2] || ""),
        phone: String(row[3] || ""),
        sizes: {
          ss: row[4], s: row[5], m: row[6], l: row[7], xl: row[8],
          '2xl': row[9], '3xl': row[10], '4xl': row[11], '5xl': row[12]
        },
        total: row[13],
        paymentStatus: String(row[17] || "รอตรวจสอบข้อมูล"),
        shippingStatus: String(row[18] || "รอจัดส่ง")
      })).filter(item => item.fullName !== ""); // กรองแถวว่าง
      
      return returnData({ data: result }, callback);
    } catch (err) {
      return returnData({ error: err.toString() }, callback);
    }
  }
  return ContentService.createTextOutput("Action not found");
}

function returnData(obj, callback) {
  const output = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + output + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}
