import React, { Component } from "react";

interface Param {
  id: number;
  name: string;
  type: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  values: Record<number, string>;
}

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const values: Record<number, string> = {};
    props.params.forEach((param) => {
      const foundValue = props.model.paramValues.find((paramValue) => paramValue.paramId === param.id);
      if (foundValue) {
        values[param.id] = foundValue.value;
      } else {
        values[param.id] = "";
      }
    });

    this.state = { values };
  }

  handleValueChange = (paramId: number, value: string) => {
    this.setState((prevState) => ({
      values: {
        ...prevState.values,
        [paramId]: value,
      },
    }));
  };

  getModel = (): Model => {
    const paramValues: ParamValue[] = [];
    this.props.params.forEach((param) => {
      paramValues.push({
        paramId: param.id,
        value: this.state.values[param.id],
      });
    });

    return { paramValues };
  };

  render() {
    return (
      <div style={{ padding: "100px", display: "grid", gap: "10px" }}>
        {this.props.params.map((param) => (
          <div
            key={param.id}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "10px",
            }}
          >
            <label htmlFor={`param-${param.id}`}>{param.name}</label>
            <input
              type="text"
              id={`param-${param.id}`}
              value={this.state.values[param.id]}
              onChange={(e) => this.handleValueChange(param.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }
}

function App() {
  const params = [
    { id: 1, name: "Name", type: "string" },
    { id: 2, name: "Age", type: "string" },
    { id: 3, name: "Email", type: "string" },
  ];

  const model = {
    paramValues: [
      { paramId: 1, value: "John" },
      { paramId: 2, value: "30" },
      { paramId: 3, value: "john@example.com" },
    ],
  };

  return (
    <>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <ParamEditor params={params} model={model} />
      </div>
    </>
  );
}

export default App;
