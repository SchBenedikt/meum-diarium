import React from 'react';

interface GrammarTableProps {
  title: string;
  headers: string[];
  rows: string[][];
}

/**
 * Renders a grammar table with support for **bold** inline formatting in cells.
 * Use **text** to highlight word endings, stems, or important parts.
 */
export function GrammarTable({ title, headers, rows }: GrammarTableProps) {
  const renderCell = (cell: string) => {
    // Split on **bold** markers and render accordingly
    const parts = cell.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-foreground/70"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/20 last:border-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-foreground/90 font-mono"
                  >
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
