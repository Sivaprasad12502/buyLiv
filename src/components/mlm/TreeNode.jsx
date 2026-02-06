import { useState } from "react";
import PlacementModal from "./PlacementModal";
import "./Tree.css";

export default function TreeNode({ node, }) {
  const [openPlacement, setOpenPlacement] = useState(null);

  if (!node) return null;


  return (
    <li className="tree-li">
      <div className="line"></div>
      {/* <div className="line2"></div> */}
      {/* NODE CARD */}
      <div
        className={`node-card ${node.is_activated ? "active" : "inactive"}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e)=>e.stopPropagation()}

      >
        <strong>{node.username}</strong>
        <span>{node.referral_code}</span>
        <span>{node.is_activated ? "Active" : "Inactive"}</span>
      </div>

      {/* CHILDREN */}
      <ul>
        {/* LEFT */}
        {node.left ? (
          <TreeNode node={node.left} />
        ) : (
          <li>
            <div className="line"></div>

            <div
              className="node-card empty-node"
              onClick={() => {
                setOpenPlacement("LEFT");
               
              }}
            >
              ➕<span>Place Left</span>
            </div>
          </li>
        )}

        {/* RIGHT */}
        {node.right ? (
          <TreeNode node={node.right} />
        ) : (
          <li>
            <div className="line"></div>
            <div
              className="node-card empty-node"
              onClick={() => {setOpenPlacement("RIGHT")
                
              }}
            >
              ➕<span>Place Right</span>
            </div>
          </li>
        )}
      </ul>

      {/* PLACEMENT MODAL */}
      {openPlacement && (
        <PlacementModal
          parentId={node.id}
          position={openPlacement}
          onClose={() => {
            setOpenPlacement(null);
            
          }}
        />
      )}
    </li>
  );
}
