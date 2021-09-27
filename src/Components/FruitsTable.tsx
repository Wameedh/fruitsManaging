import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import images from "../Assets/imgImports";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@material-ui/core";

/**
 *
 * @param params
 * @returns JSX.Element
 */
const renderGridCell = (params: GridRenderCellParams) => {
  return (
    <img
      alt=""
      src={images[params.row.fruitName.toLowerCase()]}
      width="30"
      height="30"
    />
  );
};

/**
 *
 * @param str
 * @returns String
 * capitalize the first character of a given string
 */
const capitalizeFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

interface Row {
  id: string;
  fruitName: string;
  quantity: number;
  image: (params: GridRenderCellParams) => JSX.Element;
}

const initialRows = [
  {
    id: "banana",
    fruitName: "Banana",
    quantity: 25,
    image: renderGridCell,
  },
];

export default function FruitsTable() {
  const [rows, setRows] = useState(initialRows);

  const handlAddNewItem = (obj: Row) => {
    if (rows.length === 0) {
      setRows([obj]);
    } else {
      for (let i = 0; i < rows.length; i++) {
        const element = rows[i];
        if (rows[i].fruitName === obj.fruitName) {
          const newQuantity = element.quantity + obj.quantity;
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === obj.id ? { ...row, quantity: newQuantity } : row
            )
          );
        } else {
          setRows((prevRows) => {
            const newRows = [...prevRows, obj];
            return newRows;
          });
        }
      }
    }
  };

  const deleteItem = useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    []
  );

  const columns: GridColumns = useMemo(
    () => [
      { field: "Image", width: 150, renderCell: renderGridCell },
      { field: "fruitName", type: "string", flex: 1, minWidth: 150 },
      {
        field: "quantity",
        type: "number",
        flex: 1,
        minWidth: 150,
        editable: true,
      },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        minWidth: 150,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteItem(params.id)}
          />,
        ],
      },
    ],
    [deleteItem]
  );

  const processCSV = (str: any, delim = ",") => {
    const newStr = str.split(/\r?\n|\r/);

    for (let i = 0; i < newStr.length; i++) {
      const tempStr = newStr[i].split(delim);
      let obj: Row = {
        id: tempStr[0],
        fruitName: capitalizeFirstChar(tempStr[0]),
        quantity: parseInt(tempStr[1]),
        image: renderGridCell,
      };
      handlAddNewItem(obj);
    }
  };

  const readCSV = (csvFile: any) => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target != null) {
        const text = e.target.result;
        processCSV(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ height: 400, width: "50%", margin: "auto" }}>
      <p>
        You can edite the quantity of any item by clicking on the cell and
        entering a number!{" "}
      </p>
      <DataGrid columns={columns} rows={rows} rowHeight={57} />
      <Button
        className="btn-choose"
        variant="outlined"
        style={{ minWidth: 100 }}
        onClick={() => {
          const input = prompt(
            "Enter fruit name and quintity sprated by comma: "
          );
          if (input !== "" && input != null) {
            processCSV(input);
          }
        }}
      >
        Add
      </Button>
      <Button
        className="btn-choose"
        variant="outlined"
        style={{ margin: 30, minWidth: 100 }}
        onClick={() => {
          setRows([]);
        }}
      >
        Clear all
      </Button>
      <label>
        <input
          type="file"
          accept=".csv"
          id="csvFile"
          name="btn-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files != null) {
              readCSV(e.target.files[0]);
            }
          }}
        ></input>
        <Button
          className="btn-choose"
          variant="outlined"
          style={{ minWidth: 100 }}
          component="span"
        >
          Import
        </Button>
      </label>
    </div>
  );
}
