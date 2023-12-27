import { Button, Dropdown, Input } from "antd";
import { FC, ReactNode, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import searchRecipesApi from "../../api/searchRecipes";
import { uniq } from "lodash";
import RecipeDetails from "./Details";

interface RecipeListInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const RecipeListInput: FC<RecipeListInputProps> = ({
  value = [],
  onChange,
}) => {
  const [searching, setSearching] = useState(false);
  const [options, setOptions] = useState<
    { key: string; label: ReactNode; value: string }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");

  const debounceSearch = useMemo(() => {
    const loadOptions = async (value: string) => {
      setSearching(true);

      if (!value) {
        setOptions([]);
        setSearching(false);
        return;
      }

      const recipes = await searchRecipesApi(value);
      setOptions(
        recipes.map((recipe) => ({
          key: recipe.id,
          label: recipe.name,
          value: recipe.id,
        }))
      );
      setSearching(false);
    };

    return debounce(loadOptions, 500);
  }, []);

  async function handleSearch(value: string) {
    setSearching(true);
    setInputValue(value);
    debounceSearch(value);
  }

  async function handleSelect(val: string) {
    onChange?.(uniq([...(value || []), val]));
    setOptions([]);
    setInputValue("");
  }

  function handleRemove(index: number) {
    onChange?.(value.filter((_, i) => i !== index));
  }

  function handleBlur() {
    setTimeout(() => {
      setInputValue("");
      setOptions([]);
    }, 200);
  }

  const opts = options.map((o) => ({
    ...o,
    onClick: () => handleSelect(o.value),
  }));

  return (
    <>
      <div className="mb-1">
        <Input.Search
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          loading={searching}
          placeholder="Search for recipes"
          onBlur={handleBlur}
        />
        <Dropdown
          open={options.length > 0}
          menu={{
            items: opts,
            placeholder: "WOW",
          }}
          trigger={["click"]}
        >
          <div />
        </Dropdown>
      </div>
      <div className="flex flex-col gap-1">
        {value.map((v, i) => (
          <div className="flex gap-1 items-center" key={v}>
            <div>
              <Button size="small" danger onClick={() => handleRemove(i)}>
                &times;
              </Button>
            </div>
            <div>
              <RecipeDetails id={v}>{(val) => val.name}</RecipeDetails>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeListInput;
