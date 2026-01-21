import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosClient from "../api/axiosClient";
import TreeNode from "../components/mlm/TreeNode";
import Loading from "../components/Loader/Loading";

export default function TreeView() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p style={hint}> Drag to explore • Scroll to zoom • Click nodes for details</p>

        {loading && <Loading />}

        {/* {!loading && tree && (
          <div style={scrollWrapper}>
            <div style={treeContainer}>
              <TreeNode node={tree} />
            </div>
          </div>
        )} */}
        <div className="tree-wrapper">
         <div className="tree">
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
  textAlign:'center',
  marginTop:'20px',
  color:'rgb(56, 239, 125)',
  fontSize:"30px"
};

const hint = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "16px",
  textAlign:'center',
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
