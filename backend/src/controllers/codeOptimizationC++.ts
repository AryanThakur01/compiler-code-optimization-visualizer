import axios from "axios";

export const optimizeCplusplusCode = async (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const response = await axios.post("http://localhost:5001/analyze", {
      code,
    });
    return res.json({ optimized_code: response.data.optimized_code });
  } catch (error) {
    console.error("Error in Python API call:", error);
    return res.status(500).json({ error: "Optimization failed" });
  }
};
