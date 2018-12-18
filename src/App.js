import React, { Component } from "react";
import "./App.css";
import Select from "react-select";

import { toRupiah } from "./lib/conversi";
import { Consumer } from "./lib/context";

import axios from "axios";

class App extends Component {
  constructor() {
    super();

    this.state = {
      kotaAsal: "",
      kotaTujuan: "",
      berat: ""
    };
  }

  handleButton() {
    let { kotaAsal, kotaTujuan, berat } = this.state;
    if (kotaAsal.length !== 0 && kotaTujuan !== 0 && berat !== "") {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <Consumer>
        {ctx => {
          let { state, actions } = ctx;
          let data = {
            origin: this.state.kotaAsal,
            destination: this.state.kotaTujuan,
            weight: this.state.berat,
            courier: "jne"
          };
          return (
            <div className="container">
              <div className="header-text d-flex flex-column align-items-center justify-content-center">
                <img alt="Icon" src={require("./assets/images/icon.png")} />
                <div className="d-flex flex-row">
                  <h1 style={{ textAlign: "center", fontWeight: "700" }}>
                    Cek Ongkir
                  </h1>
                </div>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  actions.checkOngkir(data);
                }}
              >
                <div className="row">
                  <div
                    className="col-md-6 col-sm-6 col-xs-6"
                    style={{ margin: "15px 0 0" }}
                  >
                    <Select
                      isLoading={state.isLoading}
                      placeholder="Kota asal"
                      onChange={e =>
                        this.setState({ kotaAsal: e.value.toString() })
                      }
                      options={state.prv}
                    />
                  </div>
                  <div
                    className="col-md-6 col-sm-6 col-xs-6"
                    style={{ margin: "15px 0 0" }}
                  >
                    <Select
                      isLoading={state.isLoading}
                      placeholder="Kota tujuan"
                      onChange={e =>
                        this.setState({ kotaTujuan: e.value.toString() })
                      }
                      options={state.prv}
                    />
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="beratBarang">Berat Barang</label>
                  <input
                    type="text"
                    className="form-control c-input"
                    id="beratBarang"
                    aria-describedby="beratBarang"
                    placeholder="Masukan berat barang"
                    onChange={e =>
                      this.setState({ berat: parseInt(e.target.value) })
                    }
                  />
                </div>
                <button
                  disabled={this.handleButton()}
                  className={`btn btn-warning btn-block`}
                  onClick={() => {
                    // actions.checkOngkir(data);
                  }}
                >
                  Cek Sekarang
                </button>
              </form>
              <small className="text-muted" style={{ margin: "15px 0 0" }}>
                *Harga yang keluar berdasarkan harga dari JNE
              </small>
              {state.loadingResult ? (
                <div className="text-center">
                  <div
                    className="lds-ellipsis"
                    style={{ margin: "50px 0 -20px" }}
                  >
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#393e46",
                      fontWeight: "500",
                      opacity: 0.5
                    }}
                  >
                    Loading...
                  </p>
                </div>
              ) : state.result === null ? (
                <div style={{ visibility: "visible" }} />
              ) : (
                <div className="result">
                  <h1 style={{ fontWeight: "700", marginBottom: 10 }}>
                    Result
                  </h1>
                  <div className="row">
                    {state.result.costs.map((costs, i) => (
                      <div
                        key={i}
                        className={
                          state.result.costs.length === 2
                            ? "col-md-6"
                            : "col-md-4"
                        }
                      >
                        <div className="result-content text-left">
                          <h2>{costs.service}</h2>
                          {costs.cost.map((value, i) => {
                            return (
                              <div key={i}>
                                <h4>Rp {toRupiah(value.value)}</h4>
                                <p style={{ opacity: 0.5 }}>
                                  Estimasi waktu {value.etd} hari
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default App;
