import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Button,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";
import { useAppSelector } from "../hooks";
import { useState } from "react";
import { customerApi } from "../api/customer";

interface Inputs {
  name: string;
  phoneNo: string;
  email: string;
  type: number;
  project: number;
  csc: number;
  remarks: string;
}

export default function CreateCustomer() {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // react-redux
  const { branches, projects, types } = useAppSelector(
    (state) => state.inventory
  );

  // react-hook-form
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<Inputs>();

  // select input array
  const selectInputsArr: {
    name: "project" | "csc" | "type";
    label: string;
    noOptionText: string;
    options: { name: string; id: number }[];
  }[] = [
    {
      name: "type",
      label: "Select Customer Type",
      noOptionText: "Sorry! No customer matching",
      options: types,
    },
    {
      name: "project",
      label: "Select Project Name",
      noOptionText: "Sorry! No project matching",
      options: projects,
    },
    {
      name: "csc",
      label: "Select Branch",
      noOptionText: "Sorry! No branch matching",
      options: branches,
    },
  ];

  // add customer handler
  const addCustomer: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const res = await customerApi.create(data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create Customer" />
      <div className="w-[800px] max-w-[90%] mx-auto px-5 py-10 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(addCustomer)}>
          <div className="grid gap-5 grid-cols-2">
            <TextField
              fullWidth
              label="Name"
              error={Boolean(errors["name"])}
              {...register("name", { required: true })}
            />

            <TextField
              fullWidth
              label="Phone No"
              error={Boolean(errors["phoneNo"])}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+88</InputAdornment>
                ),
              }}
              {...register("phoneNo", {
                required: true,
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "invalid phone number",
                },
              })}
            />

            <TextField
              fullWidth
              label="Email"
              error={Boolean(errors["email"])}
              {...register("email", {
                required: true,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid Email",
                },
              })}
            />

            {selectInputsArr.map(({ name, label, noOptionText, options }) => (
              <Controller
                key={name}
                control={control}
                name={name}
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option?.name}
                    noOptionsText={noOptionText}
                    value={options.find((i) => i.id === value) || null}
                    onChange={(_, newVal) => onChange(newVal?.id || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(error)}
                        fullWidth
                        size="medium"
                        label={label}
                      />
                    )}
                  />
                )}
              />
            ))}

            <div className="col-span-2">
              <TextField
                fullWidth
                label="Remarks"
                multiline
                minRows={3}
                error={Boolean(errors["remarks"])}
                {...register("remarks", { required: false })}
              />
            </div>
          </div>
          <Divider className="!my-5" />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!py-3 !font-semibold"
            startIcon={<Add />}
            disabled={loading}
          >
            Create Customer
          </Button>
        </form>
      </div>
    </div>
  );
}
