import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stack,
  TextField,
  Button,
  Divider,
  Toolbar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { matchIsValidColor, MuiColorInput } from "mui-color-input";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { TreeNode } from "./tree";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export type FormInputs = {
  value: string;
  backgroundColor: string;
  textColor: string;
  lineColor: string;
  dashedLine: boolean;
  arrowedLine: boolean;
};

const schema = yup.object().shape({
  value: yup.string().required("value is required"),
});

function EditNodeForm({
  selectedNode,
  onSubmit,
  onDelete,
  onInvert,
  onShift,
}: {
  selectedNode: TreeNode;
  onSubmit: (data: FormInputs) => void;
  onDelete: (node: TreeNode) => void;
  onInvert: (node: TreeNode) => void;
  onShift: (node: TreeNode, direction: "left" | "right") => void;
}) {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedNode) {
      setValue("value", selectedNode.attributes.value);
      setValue("backgroundColor", selectedNode.attributes.backgroundColor);
      setValue("textColor", selectedNode.attributes.textColor);
      setValue("lineColor", selectedNode.attributes.lineAttributes.lineColor);
      setValue("dashedLine", selectedNode.attributes.lineAttributes.dashed);
      setValue("arrowedLine", selectedNode.attributes.lineAttributes.showArrow);
      console.log(selectedNode)
    }
  }, [selectedNode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Controller
          name="value"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              className="my-3"
              error={!!errors.value}
              helperText={errors.value?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="backgroundColor"
          control={control}
          defaultValue="#ffffff"
          rules={{ validate: matchIsValidColor }}
          render={({ field, fieldState }) => (
            <MuiColorInput
              {...field}
              label="Background color"
              className="my-3"
              isAlphaHidden
              format="hex"
              helperText={fieldState.invalid ? "Color is invalid" : ""}
              error={fieldState.invalid}
            />
          )}
        />
        <Controller
          name="textColor"
          control={control}
          defaultValue="#ffffff"
          rules={{ validate: matchIsValidColor }}
          render={({ field, fieldState }) => (
            <MuiColorInput
              {...field}
              label="Text color"
              className="my-3"
              isAlphaHidden
              format="hex"
              helperText={fieldState.invalid ? "Color is invalid" : ""}
              error={fieldState.invalid}
            />
          )}
        />
        <div className="flex gap-1 justify-between">
          <Button
            startIcon={<KeyboardDoubleArrowLeftIcon />}
            variant="contained"
            className="w-1/2"
            color="info"
            onClick={() => onShift(selectedNode, "left")}
          >
            Shift left
          </Button>
          <Button
            endIcon={<KeyboardDoubleArrowRightIcon />}
            variant="contained"
            className="w-1/2"
            color="info"
            onClick={() => onShift(selectedNode, "right")}
          >
            Shift right
          </Button>
        </div>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            if (selectedNode) {
              onInvert(selectedNode);
            }
          }}
        >
          Invert
        </Button>

        <Controller
          name="lineColor"
          control={control}
          defaultValue="#000000"
          rules={{ validate: matchIsValidColor }}
          render={({ field, fieldState }) => (
            <MuiColorInput
              {...field}
              label="Line color"
              className="my-3"
              isAlphaHidden
              format="hex"
              helperText={fieldState.invalid ? "Color is invalid" : ""}
              error={fieldState.invalid}
            />
          )}
        />
        <div className="flex">
            <Controller
              name="dashedLine"
              control={control}
              defaultValue={false}  
              render={({ field }) => (
                <FormControlLabel checked={getValues('dashedLine') ?? false} control={<Checkbox {...field}/>} label="Dashed Line" />
              )}
            />
            <Controller
              name="arrowedLine"
              control={control}
              defaultValue={false}  
              render={({ field }) => (
                <FormControlLabel checked={getValues('arrowedLine') ?? false} control={<Checkbox {...field}/>} label="Display Arrow" />
              )}
            />
        </div>

      </Stack>

      <Toolbar />
      <Divider />
      <Stack spacing={3}>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (selectedNode) {
              onDelete(selectedNode);
            }
          }}
        >
          Delete
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Stack>
    </form>
  );
}

export default EditNodeForm;
