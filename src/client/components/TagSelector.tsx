import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface Tag {
    id: number;
    name: string;
}

interface TagSelectorProps {
    tags: Tag[];
    onChange: (selectedTagIds: number[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, onChange }) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const handleChange = (event: any, newValue: Tag[]) => {
        setSelectedTags(newValue);
        onChange(newValue.map(tag => tag.id));
    };

    const safeTags = Array.isArray(tags) ? tags : [];


    return (
        <Autocomplete
            multiple
            options={safeTags}
            getOptionLabel={option => option.name}
            value={selectedTags}
            onChange={handleChange}
            renderInput={params => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Select or search tags"
                />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
        />
    );
};

export default TagSelector;
