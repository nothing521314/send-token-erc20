import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { parseUnits } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import "./App.css";
import { useTokenContract } from "./hooks/useContract";

function App() {
  const [inputData, setInputData] = useState("");
  const [dataTable, setDataTable] = useState<any>();
  const tokenContract = useTokenContract(
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
  );
  const { account, activate } = useWeb3React();

  const handleConfirm = async () => {
    const arr = inputData.split("\n");
    const txArr = arr.map(async (item) => {
      const user = item.split(",");
      const tx = await tokenContract?.functions.transfer(
        user[1],
        parseUnits(user[0], 18)
      );
      return {
        amount: user[0],
        address: user[1],
        txHash: tx?.hash,
      };
    });

    const dataTable = await Promise.all(txArr);
    setDataTable(dataTable);
  };

  useEffect(() => {
    if (dataTable) {
      const btn = document.getElementById("export-csv");
      btn?.click();
    }
  }, [dataTable]);

  const handleConnect = async () => {
    const injected = new InjectedConnector({});
    await activate(injected, undefined, true);
  };
  console.log(dataTable);
  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "500px",
            alignItems: "center",
            position: "absolute",
            top: "20px",
          }}
        >
          <div style={{ fontSize: "20px", minWidth: "500px" }}>{account}</div>
          <button
            style={{
              width: "80px",
              height: "40px",
              marginLeft: "20px",
            }}
            onClick={handleConnect}
          >
            Connect
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
          }}
        >
          <textarea
            name="address"
            id=""
            cols={30}
            rows={10}
            onChange={(e) => {
              setInputData(e.target.value);
            }}
          />
          <button
            style={{
              width: "80px",
              height: "40px",
              marginTop: "20px",
            }}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
        <br />
        <br />
        <br />
        <div style={{ textAlign: "left", paddingBottom: "20px" }}>
          {dataTable && (
            <CSVLink
              data={dataTable}
              style={{ color: "white", fontSize: "18px" }}
              id="export-csv"
            />
          )}
        </div>
        <div style={{ background: "white", color: "black", fontSize: "18px" }}>
          <table id="customers">
            <tr>
              <th>Amount</th>
              <th>Address</th>
              <th>Hash</th>
            </tr>
            {dataTable &&
              dataTable.map((item: any) => {
                return (
                  <tr>
                    <td>{item.amount}</td>
                    <td>{item.address}</td>
                    <td>{item.txHash}</td>
                  </tr>
                );
              })}
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
