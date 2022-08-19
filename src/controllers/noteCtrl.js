import Notes from '../models/noteModel.js'

const noteCtrls = {
    // POST api/note/
    createNote: async (req, res) => {
        const { title, content, uid } = req.body;
        if(!title || !content) {
            return res.status(400).json({msg: 'Please fill in all the required fields.'});
        }
        try {
            const note = await Notes({title, content, uid}).save()
            const newNote = await note.populate("uid", "-password -secret");
            res.status(200).json({data: newNote});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // GET api/notes/
    getNotes: async (req, res) => {
        const uid = req.user._id;
        try {
            const notes = await Notes.find({uid});
            res.status(200).json({data: notes});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // GET api/note/
    getNote: async (req, res) => {
        try {
            const note = await Notes.findById(req.params.id);
            if(!note) {
                return res.status(404).json({msg: 'Not found note.'});
            }
            res.status(200).json(note);
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // DELETE api/note/:id
    deleteNote: async (req, res) => {
        try {
            const note = await Notes.findByIdAndDelete(req.params.id);
            if(!note) {
                return res.status(404).json({msg: 'Not found note to delete.'});
            }
            res.status(200).json({msg: 'Deleted successfully', note});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // PUT api/note/:id
    editNote: async (req, res) => {
        const {title, content} = req.body;
        try {
            const note = await Notes.findByIdAndUpdate(req.params.id, { title, content }, {new: true});
            if(!note) {
                return res.status(404).json({msg: 'Not found note to update.'});
            }
            res.status(200).json({msg: 'Update successfully', note});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },
}

export default noteCtrls;