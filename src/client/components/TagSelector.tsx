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
        // Limit to 3 tags
        if (newValue.length <= 3) {
            setSelectedTags(newValue);
            onChange(newValue.map(tag => tag.id));
        } else {
            alert("You can select up to 3 tags only.");
        }
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
