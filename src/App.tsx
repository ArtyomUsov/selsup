import { Component } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
} from "@mui/material";

interface Param {
  id: number;
  name: string;
  type: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  colorId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  values: Record<number, string>;
  params: Param[];
  errors: Record<number, string>;
  isFormChanged: boolean;
}

// данные получены после GET запроса //
const params: Param[] = [
  { id: 1, name: "Наименование", type: "string" },
  { id: 2, name: "Вес", type: "string" },
  { id: 3, name: "Страна производства", type: "string" },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: "Гвозди" },
    { paramId: 2, value: "30 кг" },
    { paramId: 3, value: "Китай" },
  ],
  colors: [{ colorId: 1, value: "red" }],
};

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
    this.state = { values, params: [...props.params], errors: {}, isFormChanged: false };
  }

  handleValueChange = (paramId: number, value: string) => {
    const originalValue = this.props.model.paramValues.find((param) => param.paramId === paramId)?.value;
    const isSameAsOriginal = originalValue === value;
    if (this.state.values[paramId] === value) {
      return;
    }

    this.setState(
      (prevState) => ({
        values: {
          ...prevState.values,
          [paramId]: value,
        },
        isFormChanged: value !== "",
      }),
      () => {
        if (value === "" || isSameAsOriginal) {
          this.setState({ isFormChanged: false });
        }
      }
    );
  };

  handleNameChange = (paramId: number, newName: string) => {
    const { params, errors } = this.state;
    const duplicateName = params.some((param) => param.name === newName && param.id !== paramId);
    if (duplicateName) {
      this.setState({
        errors: { ...errors, [paramId]: "Имя параметра уже существует" },
      });
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors[paramId];
      this.setState({ errors: updatedErrors });
    }
    this.setState((prevState) => {
      const originalName = this.props.params.find((param) => param.id === paramId)?.name;
      const isSameAsOriginal = originalName === newName;
      const emptyValue = model.paramValues.some((param) => param.value === "");
      const updatedParams = prevState.params.map((param) => {
        if (param.id === paramId) {
          return { ...param, name: newName };
        }
        return param;
      });
      if (isSameAsOriginal || newName === "" || !emptyValue) {
        return { params: updatedParams, isFormChanged: false };
      }
      return { params: updatedParams, isFormChanged: true };
    });
  };

  handleAddParam = () => {
    const newParam = { id: this.state.params.length + 1, name: "", type: "string" };
    const newValues = { ...this.state.values, [newParam.id]: "" };

    this.setState((prevState) => ({
      params: [...prevState.params, newParam],
      values: newValues,
    }));
  };

  handleDeleteParam = (paramId: number) => {
    const updatedParams = this.state.params.filter((param) => param.id !== paramId);
    const updatedValues = { ...this.state.values };
    delete updatedValues[paramId];

    this.setState({ params: updatedParams, values: updatedValues, isFormChanged: true });
  };

  handleSave = () => {
    if (!this.state.isFormChanged) {
    }

    const formData = new FormData();
    this.state.params.forEach((param) => {
      formData.append(param.name, this.state.values[param.id]);
    });
    // делаем вид что данные успешно отправлены //
    this.setState({ isFormChanged: false });
    // делаем вид что данные успешно отправлены //
    fetch("https://example.com/api/save-form", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Данные успешно сохранены", data);
        this.setState({ isFormChanged: false });
      })
      .catch((error) => {
        console.error("Ошибка при сохранении данных", error);
      });
  };

  getModel = (): Model => {
    const paramValues: ParamValue[] = [];
    const colors: Color[] = [];
    this.state.params.forEach((param) => {
      paramValues.push({
        paramId: param.id,
        value: this.state.values[param.id],
      });
    });

    return { paramValues, colors };
  };

  render() {
    const isAddParamDisabled = this.state.params.some((param) => !this.state.values[param.id]);

    return (
      <Box sx={{ maxWidth: 600, margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 4,
            gap: 3,
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "whitesmoke" }}>
                <TableRow>
                  <TableCell align="center">Параметр</TableCell>
                  <TableCell align="center">Значение</TableCell>
                  <TableCell align="center">Убрать</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.params.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell align="center">
                      <TextField
                        value={param.name}
                        label={param.name ? "" : "Новый параметр"}
                        variant="filled"
                        error={this.state.errors[param.id] ? true : false}
                        helperText={this.state.errors[param.id] ? this.state.errors[param.id] : null}
                        onChange={(e) => this.handleNameChange(param.id, e.target.value)}
                        inputProps={{ maxLength: 21 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={this.state.values[param.id]}
                        label={this.state.values[param.id] ? "" : "Новое значение"}
                        onChange={(e) => this.handleValueChange(param.id, e.target.value)}
                        variant="filled"
                        inputProps={{ maxLength: 21 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="text" color="error" onClick={() => this.handleDeleteParam(param.id)}>
                        -
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", gap: 8 }}>
              <Button variant="text" onClick={this.handleAddParam} sx={{ ml: 5 }} disabled={isAddParamDisabled}>
                Добавить параметр
              </Button>
              <Button
                variant="text"
                color="success"
                onClick={this.handleSave}
                sx={{ ml: 5 }}
                disabled={!this.state.isFormChanged}
              >
                Сохранить
              </Button>
            </Box>
          </TableContainer>
        </Box>
      </Box>
    );
  }
}

function App() {
  return (
    <>
      <ParamEditor params={params} model={model} />
    </>
  );
}

export default App;
