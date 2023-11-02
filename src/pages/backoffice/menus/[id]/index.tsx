import MultiSelect from "@/components/MultiSelect";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAppData } from "@/store/slices/appSlice";
import { updateMenuThunk, deleteMenuThunk } from "@/store/slices/menuSlice";
import { UpdateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

const MenuDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((store) => store.menu.items);
  const menu = menus.find((item) => item.id === menuId);
  const menuCategoryMenus = useAppSelector(
    (store) => store.menuCategoryMenu.items
  );
  const menuCategoryMenuFiltered = menuCategoryMenus.filter(
    (item) => item.menuId === menuId
  );
  const selectedMenuCategoryIds = menuCategoryMenuFiltered.map(
    (item) => item.menuCategoryId
  );
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const addons = useAppSelector((store) => store.addon.items);

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<UpdateMenuOptions>();

  useEffect(() => {
    if (menu) {
      setData({
        ...menu,
        menuCategoryIds: selectedMenuCategoryIds,
      });
    }
  }, [menu]);

  if (!menu || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setData({ ...data, menuCategoryIds: selectedIds });
  };

  const handleUpdate = () => {
    router.push("/backoffice/menus");
    dispatch(
      updateMenuThunk({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/menus");
        },
      })
    );
  };

  const handleDelete = () => {
    dispatch(
      deleteMenuThunk({
        id: menuId,
        onSuccess: () => {
          dispatch(fetchAppData({}));
          router.push("/backoffice/menus");
        },
      })
    );
  };

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <TextField
            defaultValue={menu.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          ></TextField>
          <TextField
            defaultValue={menu.price}
            onChange={(e) =>
              setData({ ...data, price: Number(e.target.value) })
            }
          ></TextField>
        </Box>
        <Button
          sx={{ color: "red" }}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
        >
          Delete
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogContent>
            <Typography>
              are you sure to <span style={{ color: "red" }}>delete</span>?
            </Typography>
            <Box display={"flex"} sx={{ justifyContent: "space-between" }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                }}
              >
                no
              </Button>
              <Button variant="contained" onClick={handleDelete}>
                yes
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ mt: 2 }}>
        <MultiSelect
          label={"MenuCategory"}
          selectedIds={data.menuCategoryIds}
          handleOnChange={handleOnChange}
          practical={menuCategories}
        ></MultiSelect>
        <div style={{ width: "200px", marginTop: 10 }}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Button variant="contained">Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default MenuDetail;
