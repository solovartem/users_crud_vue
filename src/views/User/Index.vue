<template>
  <div>
    <Navbar />
    <b-container>
      <Alert v-if="message && variant" :msg="message" :variant="variant" />
      <b-card header-tag="header" class="mt-5">
        <template #header>
          <h2>Contacts</h2>
          <b-button @click="showModal()" variant="primary">
            <Icon icon="plus-circle-fill" variant="white"></Icon> Add Contact
          </b-button>
        </template>
        <b-table
          striped
          bordered
          hover
          class="mb-0"
          :items="users"
          :fields="fields"
          show-empty
        >
          <!-- <template v-slot:head(selected)="row">
                        <b-form-group>
                            <input type="checkbox" v-model="row.item.selected" />
                        </b-form-group>
                    </template> -->
          <template v-slot:cell(selected)="row">
            <b-form-group>
              <input type="checkbox" v-model="row.item.selected" />
            </b-form-group>
          </template>

          <template v-slot:cell(name)="row">
            <b-form-group>
              <b-img
                class="table-avatar mr-2"
                :src="row.item.image"
              ></b-img>
              <span>{{ row.item.name }}</span>
            </b-form-group>
          </template>

          <template #cell(actions)="row">
            <template>
              <div class="action-dropdown">
                <b-dropdown variant="white">
                  <template #button-content>
                    <b-icon
                      icon="three-dots-vertical"
                      aria-hidden="true"
                    ></b-icon>
                  </template>
                  <b-dropdown-item-button @click="editUser(row)">
                    <b-icon icon="list" aria-hidden="true"></b-icon> View
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="deleteUser(row)">
                    <b-icon
                      icon="x"
                      aria-hidden="true"
                      variant="danger"
                    ></b-icon>
                    Delete
                  </b-dropdown-item-button>
                </b-dropdown>
              </div>
            </template>

            <!-- <b-col inline>
                        <button class="btn btn-primary text-white mr-2" @click="editUser(row)">
                            <Icon icon="pencil-square" variant="white"></Icon>
                        </button>
                         <button class="btn btn-success text-white mr-2" @click="showUserdata(row)">
                            <Icon icon="eye-fill" variant="white"></Icon>
                        </button>
                        <button class="btn btn-danger" @click="deleteUser(row)">
                            <Icon variant="white" icon="trash-fill"></Icon>
                        </button>
                        </b-col> -->
          </template>
        </b-table>
      </b-card>
    </b-container>
    <b-modal ref="my-modal" size="lg" id="modal-1" :title="modalTitle">
      <div class="row">
        <div class="col-6">
          <b-form>
            <b-form-group
              id="input-group-2"
              label="Full Name :"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                v-model="name"
                placeholder="Enter name"
                :class="errors.name ? 'is-invalid' : ''"
              ></b-form-input>
              <div :class="errors.name ? 'd-block invalid-feedback' : ''">
                {{ errors.name }}
              </div>
            </b-form-group>
            <b-form-group
              id="input-group-1"
              label="Email address :"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="email"
                type="email"
                placeholder="Enter email"
                :class="errors.email ? 'is-invalid' : ''"
              ></b-form-input>
              <div :class="errors.email ? 'd-block invalid-feedback' : ''">
                {{ errors.email }}
              </div>
            </b-form-group>
            <b-form-group
              id="input-group-3"
              label="Address :"
              label-for="textarea"
            >
              <b-form-textarea
                id="textarea"
                v-model="address"
                placeholder="Enter Address"
                rows="3"
                max-rows="6"
                :class="errors.address ? 'is-invalid' : ''"
              >
              </b-form-textarea>
              <div :class="errors.address ? 'd-block invalid-feedback' : ''">
                {{ errors.address }}
              </div>
            </b-form-group>
          </b-form>
        </div>
        <div class="col-6">
        <div class="mb-2">Avatar :</div>
          <input
                type="file"
                name=""
                id="image"
                ref="file"
                class="form-control form-control-sm form-avatar"
                placeholder="image"
                @change="imageUpload"
                :class="errors.image ? 'is-invalid' : ''"
            />
            <div :class="errors.image ? 'd-block invalid-feedback' : ''">
                {{ errors.image }}
              </div>
          <div class="modal-avatar w-100 text-center mt-3">
          <b-img
            :src="previewImage ? previewImage : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
          ></b-img>
          </div>
        </div>
      </div>

      <template #modal-footer>
        <div class="w-100 text-right">
          <b-button variant="secondary" class="mr-2" @click="onClose()">
            Close
          </b-button>
          <b-button variant="primary" class="" @click="onSubmit()">
            <Icon icon="check2" variant="white"></Icon>
            Save Changes
          </b-button>
        </div>
      </template>
    </b-modal>
    <b-modal ref="view-modal" id="modal-view" title="View Detail">
      <p><b>Full Name</b> : {{ name }}</p>
      <p><b>Email</b> : {{ email }}</p>
      <p><b>Address</b> : {{ address }}</p>
      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="secondary"
            class="float-left"
            @click="onCloseView()"
          >
            Close
          </b-button>
          <b-button
            variant="primary"
            class="float-right"
            @click="onCloseView()"
          >
            Save
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Alert from "../../components/Alert.vue";
// import Button from '../../components/Button.vue';
import Icon from "../../components/Icon.vue";
import Navbar from "../../components/Navbar.vue";
import UserService from "../../services/UserService";

export default {
  components: { Alert, Icon, Navbar },
  name: "User",
  mounted() {
    console.log("Components calling");
  },
  data() {
    return {
      users: [],
      fields: [],
      file1: [],
      email: "",
      name: "",
      address: "",
      modalTitle: "Create Contact",
      errors: [],
      editID: "",
      message: "",
      variant: "",
      previewImage : ""
    };
  },
  created() {
    this.userListing();
  },
  methods: {
    imageUpload() {
        const file = this.$refs.file.files[0];
        this.file1 = file;
        console.log(this.file1)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            this.previewImage = e.target.result;
        };
    },
    userListing() {
      UserService.listing_users()
        .then((response) => {
          if (response.status == 200 && response.data.response) {
            this.users = response.data.data;
            this.fields = [
              // 'selected',
              { key: "selected", label: "" },
              { key: "name", label: "Full Name", sortable: true },
              { key: "email", label: "Email", sortable: true },
              { key: "address", label: "Address", sortable: true },
              { key: "created_at", label: "Created At", sortable: true },
              { key: "actions", label: "Actions" },
            ];
          } else {
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose();
          }
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.message = "Something went wrong please try again.";
          this.variant = "danger";
          this.alertClose();
        });
    },
    onSubmit() {
      if (this.editID) {
        this.onSubmitEdit();
      } else {
        this.errors = [];
        // var data = {
        //   name: this.name,
        //   email: this.email,
        //   address: this.address,
        // };

        var formData = new FormData();
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('address', this.address);
        formData.append('image', this.file1);

        UserService.create_user(formData)
          .then((response) => {
            console.log(response);
            if (response.status == 200 && response.data.response) {
              this.$refs["my-modal"].hide();
              this.message = response.data.message;
              this.variant = "success";
              this.alertClose();
              this.name = "";
              this.email = "";
              this.address = "";
            this.previewImage = '';
              this.userListing();
            } else {
              var errorname = response.data.errors.name
                ? response.data.errors.name[0]
                : "";
              var erroremail = response.data.errors.email
                ? response.data.errors.email[0]
                : "";
              var erroraddress = response.data.errors.address
                ? response.data.errors.address[0]
                : "";
              this.errors = {
                name: errorname,
                email: erroremail,
                address: erroraddress,
                image: response.data.errors.image ? response.data.errors.image[0] : ''
              };
            }
          })
          .catch((error) => {
            console.log("Error : ", error);
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose();
            this.name = "";
            this.email = "";
            this.address = "";
            this.previewImage = '';
            this.file1 = ''
          });
      }
    },
    showModal() {
      this.$refs["my-modal"].show();
      this.name = "";
      this.email = "";
      this.address = "";
      this.editID = "";
      this.modalTitle = "Create Contact";
    },
    onClose() {
      this.$refs["my-modal"].hide();
      this.name = "";
      this.email = "";
      this.address = "";
      this.editID = "";
      this.modalTitle = "Create Contact";
      this.previewImage = ''
      this.file1 = ''
      this.errors = []
    },
    alertClose() {
      setTimeout(() => {
        this.message = "";
        this.variant = "";
      }, 2000);
    },
    editUser(userData) {
      this.errors = []
      this.modalTitle = "Edit Contact";
      this.email = userData.item.email;
      this.address = userData.item.address;
      this.name = userData.item.name;
      this.editID = userData.item.id;
      this.previewImage = userData.item.image;
      this.$refs["my-modal"].show();
    },
    onSubmitEdit() {
      this.errors = [];
    //   var data = {
    //     name: this.name,
    //     email: this.email,
    //     address: this.address,
    //   };
        var formData = new FormData();
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('address', this.address);
        formData.append('image', this.file1);
      UserService.update_user(formData, this.editID)
        .then((response) => {
          console.log(response);
          if (response.status == 200 && response.data.response) {
            this.$refs["my-modal"].hide();
            this.message = response.data.message;
            this.variant = "success";
            this.alertClose();
            this.name = "";
            this.email = "";
            this.address = "";
            this.editID = "";
            this.previewImage = '';
            this.file1 = ''
            this.modalTitle = "Create Contact";
            this.userListing();
          } else {
            var errorname = response.data.errors.name
              ? response.data.errors.name[0]
              : "";
            var erroremail = response.data.errors.email
              ? response.data.errors.email[0]
              : "";
            var erroraddress = response.data.errors.address
              ? response.data.errors.address[0]
              : "";
            this.errors = {
              name: errorname,
              email: erroremail,
              address: erroraddress,
              image: response.data.errors.image ? response.data.errors.image[0] : ''
            };
          }
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.message = "Something went wrong please try again.";
          this.variant = "danger";
          this.alertClose();
          this.name = "";
          this.email = "";
          this.address = "";
            this.previewImage = '';
            this.file1='';

          this.editID = "";
          this.modalTitle = "Add User";
        });
    },
    deleteUser(userData) {
      console.log("user data : ", userData);
      var confirmAlert = confirm("Are you sure the delete user ?");
      if (confirmAlert == true) {
        UserService.delete_user(userData.item.id)
          .then((response) => {
            if (response.status == 200 && response.data.response) {
              this.message = response.data.message;
              this.variant = "success";
              this.alertClose();
              this.userListing();
            } else {
              this.message = "Something went wrong please try again.";
              this.variant = "danger";
              this.alertClose();
            }
          })
          .catch((error) => {
            console.log("Error : ", error);
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose();
          });
      }
    },
    showUserdata(row) {
      console.log(row);
      this.$refs["view-modal"].show();
      this.name = row.item.name;
      this.email = row.item.email;
      this.address = row.item.address;
    },
    onCloseView() {
      this.$refs["view-modal"].hide();
      this.name = "";
      this.email = "";
      this.address = "";
      this.previewImage = '';
      this.file1 = '';
      this.errors = []

    },
  },
};
</script>

<style>
nav.nav-back {
  background-color: #ff9900 !important;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
  vertical-align: middle;
}
.action-dropdown .dropdown-toggle::after {
  display: none;
}
img.profile-dropdown,
.table-avatar {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  object-fit: cover;
}
.dp-dropdown {
  background-color: #7f4c00;
}
.modal-avatar img {
    width: 180px;
    height: 180px;
    object-fit: cover;
}
.form-avatar {
    padding-bottom: 32px !important;
}
</style>