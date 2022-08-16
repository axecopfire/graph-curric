// import { useRef, useEffect } from "react";

// import { Network, DataSet } from "vis-network";

// // Failed to figure out how to get this to render
// // Breaks because DataSet sucks
// const VisTest: React.FC = () => {
//   // Thanks https://www.jamestharpe.com/react-visjs/
//   const visJsRef = useRef(null);
//   useEffect(() => {
//     const nodes = new DataSet(
//       [
//         { id: 1, label: "Node 1" },
//         { id: 2, label: "Node 2" },
//         { id: 3, label: "Node 3" },
//         { id: 4, label: "Node 4" },
//         { id: 5, label: "Node 5" },
//       ],
//       {}
//     );

//     const edges = [
//       { from: 1, to: 3 },
//       { from: 1, to: 2 },
//       { from: 2, to: 4 },
//       { from: 2, to: 5 },
//       { from: 3, to: 3 },
//     ];

//     const network =
//       visJsRef.current && new Network(visJsRef.current, { nodes, edges });
//   }, [visJsRef]);

//   return <div ref={visJsRef}></div>;
// };

// export default VisTest;
