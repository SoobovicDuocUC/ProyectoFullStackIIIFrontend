import "./Table.css";

export const Table = ({ children, className = "" }) => {
  return (
    <table className={`table ${className}`}>
      {children}
    </table>
  );
};

export const TableHead = ({ children }) => {
  return (
    <thead>
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children }) => {
  return (
    <tr>
      {children}
    </tr>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <th>
      {children}
    </th>
  );
};

export const TableCell = ({ children }) => {
  return (
    <td>
      {children}
    </td>
  );
};
