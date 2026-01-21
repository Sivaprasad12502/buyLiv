import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosClient from "../api/axiosClient";
import TreeNode from "../components/mlm/TreeNode";
import Loading from "../components/Loader/Loading";
import { FiRefreshCw, FiZoomIn, FiZoomOut } from "react-icons/fi";

export default function TreeView() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastDistance = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;

    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const stopDrag = () => {
    isDragging.current = false;
  };
  const zoomIn = () => setScale((s) => Math.min(3, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  useEffect(() => {
    axiosClient
      .get("/mlm/tree/")
      .then((res) => setTree(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div style={page}>
        <h2 style={title}>My Genealogy Tree</h2>
        <p style={hint}> Drag to explore • Click nodes for details</p>
        <div className="zoom-controls">
          <button onClick={zoomIn} className="zoom-btn"><FiZoomIn size={20}/></button>
          <button onClick={zoomOut} className="zoom-btn"><FiZoomOut size={20}/></button>
          <button onClick={resetZoom} className="zoom-btn"><FiRefreshCw size={30}/></button>
        </div>
        {loading && <Loading />}

        {/* {!loading && tree && (
          <div style={scrollWrapper}>
            <div style={treeContainer}>
              <TreeNode node={tree} />
            </div>
          </div>
        )} */}
        <div className="tree-wrapper">
          <div
            className="tree"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging.current ? "grabbing" : "grab",
              userSelect: "none",
              willChange: "transform",
            }}
          >
            <ul>
              <TreeNode node={tree} />
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= STYLES ================= */

const page = {
  width: "100%",
};

const title = {
  marginBottom: "6px",
  textAlign: "center",
  marginTop: "20px",
  color: "rgb(56, 239, 125)",
  fontSize: "30px",
};

const hint = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "16px",
  textAlign: "center",
};

const scrollWrapper = {
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const treeContainer = {
  display: "inline-flex",
  alignItems: "flex-start",
  padding: "30px 40px",
  minWidth: "max-content", // 🔥 critical
};
