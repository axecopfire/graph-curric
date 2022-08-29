import { useEffect, useState } from "react";
import { Node } from "react-flow-renderer";

/**
 * This was a part of FileListFlow.
 * The idea was to be able to click and drag elements to group together under parentNodes.
 * This is a TODO follow on feature
 */
export default function useGroupNode({
  nodes,
  setNodes,
  lastDraggedNode,
  timer,
  setTimer,
}) {
  useEffect(() => {
    const doAllTheThings = async () => {
      if (timer < 5) {
        setTimeout(() => {
          setTimer(timer + 1);
        }, 100);
      }
      if (timer === 5) {
        const isNodeIntersect = (node1, node2) => {
          const xIntersect =
            node1.position.x + node1.width >= node2.position.x &&
            node1.position.x <= node2.position.x + node2.width;
          const yIntersect =
            node1.position.y + node1.height >= node2.position.y &&
            node1.position.y <= node2.position.y + node2.height;
          return xIntersect && yIntersect;
        };
        const hasIntersect =
          lastDraggedNode && !lastDraggedNode.parentNode
            ? nodes.filter((checkNode) => {
                if (checkNode.type !== "groupNode") return false;
                if (lastDraggedNode.id === checkNode.id) return false;
                return isNodeIntersect(lastDraggedNode, checkNode);
              })
            : [];
        if (hasIntersect.length) {
          const parentNode = hasIntersect[0];
          console.log(parentNode);
          const filteredArray = nodes.filter(
            (node) =>
              node.id !== parentNode.id &&
              node.id !== lastDraggedNode.id &&
              node.parentNode !== parentNode.id
          );
          const newNodeList = [
            ...filteredArray,
            {
              ...parentNode,
              data: {
                ...parentNode.data,
                width: parentNode.width + 100,
                height: parentNode.height + 100,
              },
            },
            {
              ...lastDraggedNode,
              parentNode: parentNode.id,
              extent: "parent",
            } as Node,
          ];
          // update element with parent
          // make parent bigger
          // update all elements in parent with new graph
          const childrenList = newNodeList.filter(
            (n) => n.parentNode === parentNode.id
          );

          // Add Elk and component formatting for this to work

          setNodes([...newNodeList]);
        }
      }
    };
    doAllTheThings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);
}
