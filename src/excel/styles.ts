const thinBorder = {
  top: { style: 'thin', color: { rgb: '000000' } },
  bottom: { style: 'thin', color: { rgb: '000000' } },
  left: { style: 'thin', color: { rgb: '000000' } },
  right: { style: 'thin', color: { rgb: '000000' } },
};

export const STYLES = {
  titleCell: {
    font: { bold: true, sz: 14, name: 'Arial', color: { rgb: '000000' } },
    fill: { patternType: 'solid', fgColor: { rgb: 'DCE6F1' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder,
  },

  metaLabel: {
    font: { bold: true, sz: 11, name: 'Arial' },
    fill: { patternType: 'solid', fgColor: { rgb: 'DCE6F1' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder,
  },

  metaValue: {
    font: { sz: 11, name: 'Arial' },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: thinBorder,
  },

  columnHeader: {
    font: { bold: true, sz: 11, name: 'Arial', color: { rgb: 'FFFFFF' } },
    fill: { patternType: 'solid', fgColor: { rgb: '4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder,
  },

  dataCell: {
    font: { sz: 10, name: 'Arial' },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: thinBorder,
  },

  dataCellCentered: {
    font: { sz: 10, name: 'Arial' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder,
  },
} as const;
