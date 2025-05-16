import { Table, TableHead, TableRow, TableCell, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
type headCell = { id: string | number; label: string };

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiPaper-root": {
      maxHeight: "45vh",
      backgroundImage: "none",
      overflow: "scroll",
      scrollBehavior: "auto",
    },
    "& .MuiTableCell-head": {
      fontSize: "1rem",
    },
    "& .MuiTableCell-body": {
      fontSixe: "0.6rem",
    },
  },
  table: {
    maxHeight: "100vh",
    overflow: "scroll",
    scrollBehavior: "auto",
  },
}));

export default function useTable(headCells: headCell[]) {
  const classes = useStyles();
  const TblContainer = ({ children }: { children: React.ReactNode }) => (
    <Paper elevation={2} className={classes.root}>
      <Table stickyHeader aria-label="sticky table" className={classes.table}>
        {children}
      </Table>
    </Paper>
  );

  const TblHead = () => {
    return (
      <TableHead>
        <TableRow>
          {headCells?.map((headCell) => (
            <TableCell className="text-xl" key={headCell.id}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  return {
    TblContainer,
    TblHead,
  };
}
